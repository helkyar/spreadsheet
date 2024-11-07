import { Cell } from '@/components/spreadsheet/logic/types'

const EVAL_CODE = '='

type ConstructorParams = {
  cols: number
  rows: number
}

export default class SpreadSheet {
  matrix
  private _update = () => {}

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
          update: (value) => this.updateAll({ x, y, inputValue: value }),
          // update: () => this.updateAll(),
        })
      )
    )
    return matrix
  }

  private updateCell({ x, y, inputValue }: Partial<Cell>) {
    if (x == null || y == null || !inputValue) return

    if (inputValue.startsWith(EVAL_CODE)) {
      const computedValue = this.evaluateInput(inputValue)
      this.matrix[x][y].computedValue = computedValue
      this.matrix[x][y].inputValue = inputValue
    } else {
      this.matrix[x][y].inputValue = inputValue
      this.matrix[x][y].computedValue = inputValue
    }
  }

  private updateAll(currentCellNewValues: Partial<Cell>) {
    this.updateCell(currentCellNewValues)

    this.matrix.forEach((row) => {
      row.forEach((cell) => {
        this.updateCell({ x: cell.x, y: cell.y, inputValue: cell.inputValue })
      })
    })

    this._update()
  }

  private evaluateInput(input: string) {
    let expression = input.slice(1, input.length)
    try {
      return eval(expression)
    } catch {
      let referencedExpression = ''
      let idx = ''
      let idy = ''
      let id = ''
      while (expression.length > 0) {
        id = expression[0]
        const charCode = expression.charCodeAt(0)

        if (charCode <= 90 && charCode >= 65) idx = idx + (charCode - 65)
        else if (Number.parseInt(id)) idy = idy + (Number.parseInt(id) - 1)
        else {
          const x = Number.parseInt(idx)
          const y = Number.parseInt(idy)
          const value = this.matrix[x][y].computedValue
          referencedExpression = referencedExpression + value + id

          idx = ''
          idy = ''
        }
        if (expression.length === 1) {
          const x = Number.parseInt(idx)
          const y = Number.parseInt(idy)
          const value = this.matrix[x][y].computedValue
          referencedExpression = referencedExpression + value
        }

        expression = expression.slice(1, expression.length)
      }
      return eval(referencedExpression)
    }
    //if it's a reference
    // get X from number
    // get y from letter
    // evaluate based con computedValue
    //evaluate references
    //evaluate cyclic references
  }
  setUpdateMethod(updater: () => void) {
    this._update = updater
  }
  // reference other cells
  // avoid cyclic reference
}
