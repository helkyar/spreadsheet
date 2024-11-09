import Cell from '@/components/Spreadsheet/components/Cell'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import type SpreadSheetType from '@/components/Spreadsheet/logic/SpreadSheet'
import { Cell as CellTypes } from '@/components/Spreadsheet/logic/types'
import { useTable } from '@/components/Spreadsheet/logic/useTable'

type PropTypes = {
  matrix: CellTypes[][]
  cols: number
  spreadsheet: SpreadSheetType
}

function SpreadSheet({ matrix, cols, spreadsheet }: PropTypes) {
  const { handleSelectColumn, handleSelectRow, removeSelectedFromElements } =
    useTable(spreadsheet)
  // On header Column click
  //    detect selected cells
  //    remove "selected" className if exist
  //    add "selected" className to every cell in the clicked column
  // On header row click
  //    detect selected cells
  //    remove "selected" className if exist
  //    add "selected" className to every cell in the clicked row
  // On mouse press & drag
  //    detect selected cells
  //    remove "selected" className if exist
  //    add "selected" className to every cell it goes over
  //    add "selected" in a quadrilateral fashion
  //    remove "selected" in a quadrilateral fashion
  // On key press
  //    Backspace ->
  //      detect selected cells
  //      remove all inputValues of the selected cells if they exist
  //    Arrow ->
  //      detect selected cells
  //      remove "selected" className if it exists
  //    Shift + Arrow ->
  //      detect selected cells
  //      remove "selected" className if it exists
  //      add "selected" className in a quadrilateral fashion in the direction of the arrows
  //    Value Key ->
  //      detect selected cells
  //      add key value to all inputValues of the selected cells if they exist

  return (
    <table onClick={removeSelectedFromElements}>
      <thead>
        <tr>
          {getColumnsHeaderLabels(cols).map((columLabel, y) => (
            <th key={columLabel} onClick={handleSelectColumn(y)}>
              {columLabel}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix?.map((row, x) => (
          <tr key={x}>
            <td onClick={handleSelectRow(x)} className='row-header'>
              {x + 1}
            </td>
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
