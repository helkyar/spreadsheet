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
  id: string
  x: number
  y: number
  expression: string
}

export default class MatrixClient {
  matrix
  private _update = () => {}
  private updateList = [] as unknown as UpdateList[]
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
        this.generateNewCellValues({
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

  private updateCellAndActualize(inputCellValues: PartialCell) {
    const newCellValues = this.generateNewCellValues(inputCellValues)
    const { refArray, expression } = newCellValues
    newCellValues.expression = this.generateRefCellFormula(refArray, expression)
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

  private generateNewCellValues({ x, y, inputValue }: PartialCell) {
    const newCellValues = {
      x,
      y,
      inputValue,
      expression: '',
      refArray: null as unknown as RefIndexArray[],
      cyclicError: '',
    }
    const { expression, refArray } = this.processInputValue(inputValue)
    if (!refArray) {
      const referenceIndex = this.updateList.findIndex(
        (ref) => ref.x === x && ref.y === y
      )
      if (referenceIndex >= 0) this.updateList.splice(referenceIndex, 1)
      newCellValues.expression = expression
    } else {
      const refValues = { x, y, refArray, expression }
      const { refIndexArray, cyclic } = this.generateRefArray(refValues)
      newCellValues.cyclicError = cyclic ? cyclic : ''
      newCellValues.refArray =
        refIndexArray || (null as unknown as RefIndexArray[])
    }
    return newCellValues
  }

  private processInputValue(input: string): ReturnedProcessInput {
    if (!input.startsWith(EVAL_CODE))
      return { expression: input, refArray: null }
    const expression = input.slice(1)
    const referencePattern = /([A-Z]{1,3}[0-9]{1,7})/g
    const referenceFound = expression.match(referencePattern)
    if (!referenceFound) return { expression, refArray: null }
    return { expression, refArray: referenceFound }
  }

  private updateAll() {
    if (this.updateList.length === 0) return

    this.updateList.forEach((ref) => {
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

    const computedValue = this.evaluateInput(expression)
    this.matrix[x][y].computedValue = computedValue
    if (inputValue) this.matrix[x][y].inputValue = inputValue
  }

  private evaluateInput(expression: string) {
    try {
      return eval(expression)
    } catch (error) {
      return `##ERROR ${error}`
    }
  }

  private generateRefArray({ refArray, expression, x, y }: CreateRefValues) {
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
      id: `${x}/${y}`,
    }

    const referenceIndex = this.updateList.findIndex(
      (ref) => ref?.id === newReference.id
    )
    const isCyclic = this.findCyclicReferences(newReference)
    if (isCyclic) {
      if (referenceIndex >= 0) this.updateList.splice(referenceIndex, 1)
      return { cyclic: '##Error: cyclic ref' }
    }

    if (referenceIndex >= 0) this.updateList[referenceIndex] = newReference
    if (referenceIndex < 0) this.updateList.push(newReference)

    return { refIndexArray }
  }

  private generateRefCellFormula(
    refIndexArray: RefIndexArray[],
    expression: string
  ) {
    const formula = `(function(){
        ${refIndexArray
          ?.map((cell) => {
            const computedValue = this.matrix[cell.x][cell.y].computedValue
            return `const ${cell.ref} = ${JSON.stringify(computedValue)}`
          })
          .join('\n')}
        return %{expression}%
      })()`

    return formula.replace('%{expression}%', expression)
  }

  private findCyclicReferences(newRef: UpdateList) {
    const isSelfRef = newRef.refIndexArray.some(
      (ref) => ref.x === newRef.x && ref.y === newRef.y
    )
    if (isSelfRef) return true

    const isCyclic = this.updateList.some((ref) => {
      const referenced = ref.x === newRef.x && ref.y === newRef.y
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
  // assign constants based on their computed values
  // create a list of cells with references and only update those
}
