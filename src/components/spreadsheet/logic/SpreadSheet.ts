import { Cell } from '@/components/spreadsheet/logic/types'

type ConstructorParams = {
  cols: number
  rows: number
}

export default class SpreadSheet {
  matrix
  private _render = () => {}

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
          update: (value) => this.updateMatrix({ x, y, inputValue: value }),
        })
      )
    )
    return matrix
  }

  private updateMatrix({ x = 0, y = 0, inputValue = '' }: Partial<Cell>) {
    this.matrix[x][y].inputValue = inputValue
    this.matrix[x][y].computedValue = inputValue
    this._render()
  }

  subscribe(renderer: () => void) {
    this._render = renderer
  }
  // FIX_ME: should be a Table method
  // assign inputValue
  // calculate computedValue
  // reference other cells
  // avoid cyclic reference
}
