import {
  Cell,
  CellObject,
  ConstructorParams,
  Matrix,
  MatrixParams,
  PartialCell,
  Reference,
  UpdateRef,
} from '@/context/matrix/data/types'
import { parser } from '@/context/matrix/parser'

export default class ComputedMatrix {
  private _matrix: Matrix
  private _update = () => {}
  private debounceId = 0
  private cellId = 0
  private refList = [] as Reference[]

  constructor({ cols, rows, matrix }: ConstructorParams) {
    this._matrix = this.createMatrix({
      cols,
      rows,
      matrix,
    } as ConstructorParams)

    if (matrix && this._matrix.length > 0) this.generateAllReferences()
  }

  private createMatrix({ cols, rows, matrix }: ConstructorParams) {
    if (matrix) return this.createMatrixFromMatrix(matrix)
    return this.createMatrixFromNumbers({ rows, cols })
  }

  private createMatrixFromMatrix(matrix: Matrix) {
    return matrix.map((rows) =>
      rows.map((cell) => this.generateCellObject(cell))
    )
  }

  private createMatrixFromNumbers({ rows, cols }: MatrixParams) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, (): Cell => this.generateCellObject())
    )
  }

  private generateCellObject(cell?: CellObject) {
    return {
      computedValue: '',
      inputValue: '',
      ...cell,
      id: this.cellId++,
      update: (value: string, id: number) =>
        this.updateCellAndActualize({ id, inputValue: value }),
    }
  }

  private generateAllReferences() {
    this._matrix.forEach((row) =>
      row.forEach((cell) => this.updateCellAndActualize(cell))
    )
  }

  get matrix() {
    return this._matrix
  }

  private updateCellAndActualize(inputCellValues: PartialCell) {
    this.updateCell(inputCellValues)

    this.debouncedUpdateAll()
  }

  private updateCell({ id, inputValue }: PartialCell) {
    const cell = this._matrix.flat().find((cell) => cell.id === id)
    if (!cell) {
      this.updateRefList({ id, hasRef: false })
      return ''
    }

    const { computedValue, hasRef } = parser.parse({
      id,
      expression: inputValue,
      matrix: this._matrix,
    })

    this.updateRefList({ id, inputValue, computedValue, hasRef })

    cell.computedValue = computedValue
    cell.inputValue = inputValue
    return computedValue
  }

  private updateRefList({ id, inputValue, computedValue, hasRef }: UpdateRef) {
    const refIdx = this.refList.findIndex((ref) => ref.id === id)

    if (!hasRef || !inputValue) {
      if (refIdx >= 0) this.refList.splice(refIdx, 1)
      return
    }

    if (refIdx < 0) {
      this.refList.push({ id, inputValue, computedValue })
    } else {
      this.refList[refIdx] = {
        ...this.refList[refIdx],
        inputValue,
        computedValue,
      }
    }
  }

  private debouncedUpdateAll(ms = 5) {
    const id = this.debounceId + 1
    this.debounceId = id

    setTimeout(() => {
      if (id !== this.debounceId) return
      this.updateAll()
    }, ms)
  }

  private updateAll() {
    let keepTheLoop = true

    while (keepTheLoop) {
      keepTheLoop = false
      this.refList.forEach((ref) => {
        const newComputedValue = this.updateCell({ ...ref })
        if (newComputedValue !== ref.computedValue) {
          keepTheLoop = true
        }
      })
    }
    this._update()
  }

  addColumn(y: number) {
    if (y < 0 || y > this.matrix[0].length) return

    this.matrix.forEach((row) => {
      const newCell = this.generateCellObject()
      row.splice(y, 0, newCell)
    })

    this.updateAll()
  }

  addRow(x: number) {
    if (x < 0 || x > this.matrix.length) return

    const newRow = Array.from({ length: this.matrix[0].length }, () =>
      this.generateCellObject()
    )
    this.matrix.splice(x, 0, newRow)

    this.updateAll()
  }

  // INVESTIGATE: updating references in the creation of the matrix
  // generates a crazy case where references are pre-updated before the change occurs
  // example: addColumn(0) -> coordinates of references are updated before the column is added
  removeColumn(y: number) {
    if (y < 0 || y >= this.matrix.length) return
    this.matrix.forEach((row) => {
      row.splice(y, 1)
    })

    this.updateAll()
  }

  removeRow(x: number) {
    if (x < 0 || x >= this.matrix.length) return

    this.matrix.splice(x, 1)

    this.updateAll()
  }

  setUpdateMethod(updater: () => void) {
    this._update = updater
  }
}
