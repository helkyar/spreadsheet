import {
  getAlphabeticalCode,
  getIndexFromLabel,
} from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { Cell } from '@/context/matrix/data/types'
const EVAL_CODE = '='

type ConstructorParams =
  | { rows: number; cols: number; matrix: undefined }
  | { matrix: Cell[][]; rows: undefined; cols: undefined }

type PartialCell = {
  x: number
  y: number
  inputValue: string
}

type MatrixParams = {
  rows: number
  cols: number
}

type UpdateCellValues = {
  x: number
  y: number
  inputValue?: string
  expression: string
}

type CreateRefValues = {
  x: number
  y: number
  refArray: RegExpMatchArray
  expression: string
}

type RefIndexArray = {
  x: number
  y: number
  ref: string
}

type ReturnedProcessInput =
  | { expression: string; refArray: null }
  | { expression: string; refArray: RegExpMatchArray }

type UpdateList = {
  refIndexArray: RefIndexArray[]
  x: number
  y: number
  expression: string
}

export default class MatrixClient {
  matrix
  private _update = () => {}
  private listOfReferences = [] as unknown as UpdateList[]
  private timeoutId = 0

  constructor({ cols, rows, matrix }: ConstructorParams) {
    this.matrix = this.createMatrix({ cols, rows, matrix } as ConstructorParams)
  }

  private createMatrix({ cols, rows, matrix }: ConstructorParams) {
    if (matrix) return this.createMatrixFromMatrix(matrix)
    else return this.createMatrixFromNumbers({ rows, cols })
  }

  private createMatrixFromMatrix(matrix: Cell[][]) {
    return matrix.map((rows) =>
      rows.map((cell) => {
        this.generateExpressionAndReferences({
          x: cell.x,
          y: cell.y,
          inputValue: cell.inputValue,
        })
        return {
          ...cell,
          update: (value: string) =>
            this.updateCellAndActualize({
              x: cell.x,
              y: cell.y,
              inputValue: value,
            }),
        }
      })
    )
  }

  private createMatrixFromNumbers({ rows, cols }: MatrixParams) {
    return Array.from({ length: rows }, (_, x) =>
      Array.from(
        { length: cols },
        (_, y): Cell => ({
          x,
          y,
          inputValue: '',
          computedValue: '',
          update: (value) =>
            this.updateCellAndActualize({ x, y, inputValue: value }),
          id: `${getAlphabeticalCode(y)}${x + 1}`,
          references: [],
        })
      )
    )
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
      const referenceIndex = this.listOfReferences.findIndex(
        (ref) => ref.x === x && ref.y === y
      )
      if (referenceIndex >= 0) this.listOfReferences.splice(referenceIndex, 1)

      return { hasRef: null, expression, isCyclic: false, refIndexArray: null }
    }

    const { refIndexArray, isCyclic } = this.updateReferencesList({
      refArray,
      x,
      y,
      expression,
    })

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
    x,
    y,
    expression,
  }: CreateRefValues) {
    const refIndexArray = refArray.map((ref) => {
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
      expression,
      x,
      y,
    }

    const referenceIndex = this.listOfReferences.findIndex(
      (ref) => ref?.x === newReference.x && ref?.y === newReference.y
    )
    const isCyclic = this.findCyclicReferences(newReference)

    if (isCyclic) {
      if (referenceIndex >= 0) this.listOfReferences.splice(referenceIndex, 1)
    } else {
      if (referenceIndex >= 0)
        this.listOfReferences[referenceIndex] = newReference
      if (referenceIndex < 0) this.listOfReferences.push(newReference)
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
    if (this.listOfReferences.length === 0) return

    this.listOfReferences.forEach((ref) => {
      const expression = this.generateRefCellFormula(
        ref.refIndexArray,
        ref.expression
      )
      this.updateCell({ x: ref.x, y: ref.y, expression })
    })

    this._update()
  }

  private updateCell({ x, y, inputValue, expression }: UpdateCellValues) {
    if (x == null || y == null) return

    const computedValue = expression
      ? this.evaluateInput(expression)
      : inputValue
    this.matrix[x][y].computedValue = computedValue
    if (inputValue) this.matrix[x][y].inputValue = inputValue
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

  private findCyclicReferences(newRef: UpdateList) {
    const isSelfRef = newRef.refIndexArray.some(
      (ref) => ref.x === newRef.x && ref.y === newRef.y
    )
    if (isSelfRef) return true

    const isCyclic = this.listOfReferences.some((ref) => {
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

  setUpdateMethod(updater: () => void) {
    this._update = updater
  }
}
