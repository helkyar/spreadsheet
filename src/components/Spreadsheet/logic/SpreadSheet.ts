import { getAlphabeticalCode } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { Cell } from '@/components/Spreadsheet/logic/types'

const EVAL_CODE = '='

type ConstructorParams = {
  cols: number
  rows: number
}

type PartialCell = {
  x: number
  y: number
  inputValue: string
}

export default class SpreadSheet {
  matrix
  private _update = () => {}
  private cellConstants = ''

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
          id: `${getAlphabeticalCode(y)}${x + 1}`,
          references: [],
        })
      )
    )
    return matrix
  }

  private updateAll(currentCellNewValues: PartialCell) {
    const { x, y, inputValue } = currentCellNewValues
    const isCyclic = this.findCyclicReferences(this.matrix[x][y], inputValue)
    if (isCyclic) return

    this.generateCellConstantValues()
    this.updateCell(currentCellNewValues)

    this.matrix.forEach((row) => {
      row.forEach((cell) => {
        this.updateCell({ x: cell.x, y: cell.y, inputValue: cell.inputValue })
      })
    })

    this._update()
  }

  generateCellConstantValues() {
    this.cellConstants = `(function(){
      ${this.matrix
        .map((row) =>
          row
            .map(
              (cell) =>
                `const ${cell.id} = ${JSON.stringify(cell.computedValue)}`
            )
            .join('\n')
        )
        .join('\n')}
      return %{expression}%
    })()`
  }

  private updateCell({ x, y, inputValue }: PartialCell) {
    if (x == null || y == null) return

    const computedValue = this.evaluateInput(inputValue)
    this.matrix[x][y].computedValue = computedValue
    this.matrix[x][y].inputValue = inputValue
  }

  private evaluateInput(input: string) {
    if (!input.startsWith(EVAL_CODE)) return input
    const expression = input.slice(1)

    try {
      const formula = this.cellConstants.replace('%{expression}%', expression)
      return eval(formula)
    } catch (error) {
      return `##ERROR ${error}`
    }
  }

  findCyclicReferences(updatedCell: Cell, value: string) {
    let cyclic = false
    let cellReferences: string[] = []
    if (value.includes(updatedCell.id)) {
      cyclic = true
    } else {
      const references = this.matrix.flatMap((row) =>
        row.filter((cell) => value.includes(cell.id))
      )
      cellReferences = references.map((cell) => {
        if (cell.references.includes(updatedCell.id)) {
          cyclic = true
        }
        return cell.id
      })
    }
    if (cyclic) {
      this.matrix[updatedCell.x][updatedCell.y].computedValue =
        '##ERROR: cyclic reference'
      // FIX_ME: needed to avoid loosing shown error on blur
      this.matrix[updatedCell.x][updatedCell.y].inputValue =
        '##ERROR: cyclic reference'
      this._update()
      return true
    }
    this.matrix[updatedCell.x][updatedCell.y].references = cellReferences
    return false
  }

  setUpdateMethod(updater: () => void) {
    this._update = updater
  }
  // parse formula to extract cell references REGEX (A1+J2+AA93+23)->[A1, J2, AA93]
  // get cell index based on that references
  // assign constants based on their computed values
  // create a list of cells with references and only update those
}
