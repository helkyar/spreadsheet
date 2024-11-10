import Cell from '@/components/Spreadsheet/components/Cell'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { Cell as CellTypes } from '@/components/Spreadsheet/data/types'
import { useTable } from './logic/useTable'

type PropTypes = {
  matrix: CellTypes[][]
  cols: number
}

function SpreadSheet({ matrix, cols }: PropTypes) {
  const { removeSelection, selectColumn, selectRow } = useTable()

  // On mouse press & drag
  //    detect selected cells
  //    remove "selected" className if exist
  //    add "selected" className to every cell it goes over
  //    add "selected" in a quadrilateral fashion
  //    remove "selected" in a quadrilateral fashion
  // On key press
  //    Shift + Arrow ->
  //      detect selected cells
  //      remove "selected" className if it exists
  //      add "selected" className in a quadrilateral fashion in the direction of the arrows

  return (
    <table onClick={removeSelection}>
      <thead>
        <tr>
          {getColumnsHeaderLabels(cols).map((columLabel, y) => (
            <th key={columLabel} onClick={selectColumn(y)}>
              {columLabel}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix?.map((row, x) => (
          <tr key={x}>
            <th onClick={selectRow(x)}>{x + 1}</th>
            {row.map((cell) => (
              <Cell
                key={`${cell.x}/${cell.y}`}
                cellValues={cell}
                selected={false}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SpreadSheet
