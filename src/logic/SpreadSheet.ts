import { Cell } from '@/logic/types'

type ConstructorParams = {
  cols: number
  rows: number
}

class SpreadSheet {
  matrix

  constructor({ cols, rows }: ConstructorParams) {
    this.matrix = this.createMatrix({ cols, rows })
  }

  private createMatrix({ cols, rows }: ConstructorParams) {
    const matrix = Array.from({ length: rows }, (_, x) =>
      Array.from(
        { length: cols },
        (_, y): Cell => ({
          x,
          y,
          inputValue: '',
          computedValue: '',
          update: (value) =>
            this.updateMatrixValue({ x, y, inputValue: value }),
        })
      )
    )
    return matrix
  }

  //   getCell({ x, y }: { x: number; y: number }) {
  //     return this.matrix[x][y]
  //   }

  private updateMatrixValue({ x = 0, y = 0, inputValue = '' }: Partial<Cell>) {
    this.matrix[x][y].inputValue = inputValue
    this.matrix[x][y].computedValue = inputValue
  }

  // FIX_ME: should be a Table method
  // assign inputValue
  // calculate computedValue
  // reference other cells
  // avoid cyclic reference
}

export const createSpreadSheet = (matrix: ConstructorParams) => {
  return new SpreadSheet(matrix)
}
