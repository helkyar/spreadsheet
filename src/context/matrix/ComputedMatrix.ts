import { getIndexFromLabel } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import {
  Cell,
  CellObject,
  ConstructorParams,
  Coordinates,
  CreateRefValues,
  ListOfReferences,
  MatrixParams,
  PartialCell,
  RefIndexArray,
  ReturnedProcessInput,
  UpdateCellValues,
} from '@/context/matrix/data/types'
const EVAL_CODE = '='

//TO_DO: implement single responsibility principle
//  -> parser for cell updates that returns computedValue and hasReference
//  -> if reference is found, update listOfReferences
//  -> id reference is not found, remove from listOfReferences
//FIX_ME: all cells rerender on cell change (they shouldn't)

export default class ComputedMatrix {
  private _matrix: Cell[][]
  private _update = () => {}
  private refList = [] as unknown as ListOfReferences[]
  private timeoutId = 0
  private cellCount = 0

  constructor({ cols, rows, matrix }: ConstructorParams) {
    this._matrix = this.createMatrix({
      cols,
      rows,
      matrix,
    } as ConstructorParams)
  }
  get matrix() {
    return this._matrix
  }
  private createMatrix({ cols, rows, matrix }: ConstructorParams) {
    if (matrix) return this.createMatrixFromMatrix(matrix)
    return this.createMatrixFromNumbers({ rows, cols })
  }

  private createMatrixFromMatrix(matrix: Cell[][]) {
    return matrix.map((rows) =>
      rows.map((cell) => {
        this.generateExpressionAndReferences({
          x: cell.x,
          y: cell.y,
          inputValue: cell.inputValue,
        })
        return this.generateCellObject(cell)
      })
    )
  }

  private createMatrixFromNumbers({ rows, cols }: MatrixParams) {
    return Array.from({ length: rows }, (_, x) =>
      Array.from(
        { length: cols },
        (_, y): Cell => this.generateCellObject({ x, y })
      )
    )
  }

  private generateCellObject(cell: CellObject) {
    return {
      computedValue: '',
      inputValue: '',
      ...cell,
      id: this.cellCount++,
      update: (value: string, { x, y }: Coordinates) =>
        this.updateCellAndActualize({ x, y, inputValue: value }),
    }
  }

  private processUpdatedCellValues(cellValues: PartialCell) {
    const { hasRef, expression, isCyclic, refIndexArray } =
      this.generateExpressionAndReferences(cellValues)

    let finalExpression = ''

    if (!hasRef) return { expression, ...cellValues }

    if (isCyclic) {
      finalExpression = `##Error: cyclic reference`
    } else {
      finalExpression = this.generateRefCellFormula(refIndexArray, expression)
    }

    return { expression: finalExpression, ...cellValues }
  }

  private generateExpressionAndReferences({ x, y, inputValue }: PartialCell) {
    const { expression, refArray } = this.processInputValue(inputValue)

    if (!refArray) {
      const referenceIndex = this.refList.findIndex(
        (ref) => ref.x === x && ref.y === y
      )
      if (referenceIndex >= 0) this.refList.splice(referenceIndex, 1)

      return { hasRef: null, expression, isCyclic: false, refIndexArray: null }
    }

    const referenceData = { x, y, refArray, expression, inputValue }
    const { refIndexArray, isCyclic } = this.updateReferencesList(referenceData)

    return { hasRef: refArray, expression, isCyclic, refIndexArray }
  }

  private processInputValue(input: string): ReturnedProcessInput {
    if (!input.startsWith(EVAL_CODE)) return { expression: '', refArray: null }
    const expression = input.slice(1)
    const referencePattern = /([A-Z]{1,3}[0-9]{1,7})/g
    const referenceFound = expression.match(referencePattern)
    if (!referenceFound) return { expression, refArray: null }
    return { expression, refArray: referenceFound }
  }

  private updateReferencesList({
    refArray,
    ...referenceData
  }: CreateRefValues) {
    const sanitizedRefArray = refArray.filter(
      (ref, i, self) => i === self.findIndex((r) => r === ref)
    )
    const refIndexArray = sanitizedRefArray.map((ref) => {
      const yIndex = ref.match(/([A-Z]{1,3})/g)
      const xIndex = ref.match(/([0-9]{1,7})/g)
      return {
        y: getIndexFromLabel(yIndex?.toString() || ''),
        x: Number(xIndex) - 1,
        ref,
      }
    })

    const newReference = {
      refIndexArray,
      ...referenceData,
    }

    const referenceIndex = this.refList.findIndex(
      (ref) => ref?.x === newReference.x && ref?.y === newReference.y
    )
    const isCyclic = this.findCyclicReferences(newReference)

    if (isCyclic) {
      if (referenceIndex >= 0) this.refList.splice(referenceIndex, 1)
    } else {
      if (referenceIndex >= 0) this.refList[referenceIndex] = newReference
      if (referenceIndex < 0) this.refList.push(newReference)
    }
    return { refIndexArray, isCyclic }
  }

  private updateCellAndActualize(inputCellValues: PartialCell) {
    const newCellValues = this.processUpdatedCellValues(inputCellValues)
    this.updateCell(newCellValues)

    this.debouncedUpdateAll()
  }

  private debouncedUpdateAll(ms = 5) {
    const id = this.timeoutId + 1
    this.timeoutId = id

    setTimeout(() => {
      if (id !== this.timeoutId) return
      this.updateAll()
    }, ms)
  }

  private updateAll() {
    this.refList.forEach((ref) => {
      const { expression, refIndexArray, ...refData } = ref
      const newExpression = this.generateRefCellFormula(
        refIndexArray,
        expression
      )
      this.updateCell({ ...refData, expression: newExpression })
    })

    this._update()
  }

  private updateCell({ x, y, inputValue, expression }: UpdateCellValues) {
    if (x == null || y == null) return
    const computedValue = expression
      ? this.evaluateInput(expression)
      : inputValue

    const cell = this.matrix[x][y]
    cell.computedValue = computedValue
    cell.inputValue = inputValue
  }

  private evaluateInput(expression: string) {
    if (expression.startsWith('##Error')) return expression
    try {
      return eval(expression)
    } catch (error) {
      return `##Error: ${error}`
    }
  }

  private generateRefCellFormula(
    refIndexArray: RefIndexArray[],
    expression: string
  ) {
    let error = ''
    const formula = `(function(){
        ${refIndexArray
          ?.map((cell) => {
            const computedValue = this.matrix[cell.x][cell.y].computedValue
            if (computedValue.toString().startsWith('##Error')) {
              error = computedValue
            }
            return `const ${cell.ref} = ${JSON.stringify(computedValue)}`
          })
          .join('\n')}
        return %{expression}%
      })()`

    return formula.replace('%{expression}%', error ? error : expression)
  }

  private findCyclicReferences(newRef: ListOfReferences) {
    const isSelfRef = newRef.refIndexArray.some(
      (ref) => ref.x === newRef.x && ref.y === newRef.y
    )
    if (isSelfRef) return true

    const isCyclic = this.refList.some((ref) => {
      const referenced = ref.refIndexArray.find(
        (index) => index.x === newRef.x && index.y === newRef.y
      )
      return (
        referenced &&
        newRef.refIndexArray.some(
          (newRefIdx) => ref.x === newRefIdx.x && ref.y === newRefIdx.y
        )
      )
    })
    if (isCyclic) return true

    return false
  }

  addColumn(y: number) {
    // FIX_ME: refList is pre-updated (NO IMPACT)
    if (y < 0 || y > this.matrix[0].length) return

    this.matrix.forEach((row, x) => {
      row.forEach((cell) => {
        if (cell.y >= y) cell.y++
      })
      const newCell = this.generateCellObject({ x, y })
      row.splice(y, 0, newCell)
    })

    this.refList.forEach((ref) => {
      if (ref.y >= y) ref.y++
    })

    this.updateAll()
  }

  addRow(x: number) {
    // FIX_ME: refList is pre-updated (NO IMPACT)
    if (x < 0 || x > this.matrix.length) return

    const newRow = Array.from({ length: this.matrix[0].length }, (_, y) =>
      this.generateCellObject({ x, y })
    )
    this.matrix.forEach((row) => {
      if (row[0].x >= x) row.forEach((cell) => cell.x++)
    })
    this.matrix.splice(x, 0, newRow)

    this.refList.forEach((ref) => {
      if (ref.x >= x) ref.x++
    })

    this.updateAll()
  }

  removeColumn(y: number) {
    // FIX_ME: refList is pre-updated
    if (y < 0 || y >= this.matrix.length) return
    this.matrix.forEach((row) => {
      row.splice(y, 1)
      row.forEach((cell) => {
        if (cell.y > y) cell.y--
      })
    })

    this.refList = this.refList.filter((ref) => {
      if (ref.y > y) ref.y--
      return ref.y !== y
    })

    this.updateAll()
  }

  removeRow(x: number) {
    // FIX_ME: refList is pre-updated
    if (x < 0 || x >= this.matrix.length) return

    this.matrix.splice(x, 1)
    this.matrix.forEach((row) => {
      if (row[0].x > x) row.forEach((cell) => cell.x--)
    })

    this.refList = this.refList.filter((ref) => {
      if (ref.x > x) ref.x--
      return ref.x !== x
    })

    this.updateAll()
  }

  setUpdateMethod(updater: () => void) {
    this._update = updater
  }
}
