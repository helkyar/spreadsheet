import Cell from '@/components/Spreadsheet/components/Cell'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { useTableEvents } from './logic/useTableEvents'
import { AddCellsIcon } from '@/components/Spreadsheet/components/AddCellsIcon'
import { RemoveCellsIcon } from '@/components/Spreadsheet/components/RemoveCellsIcon'
import { useMatrix } from '@/context/matrix/useMatrix'

function SpreadSheet() {
  const { selectColumn, selectRow } = useTableEvents()
  const { spreadsheetEntity, addRow, addColumn, removeColumn, removeRow } =
    useMatrix()

  const {
    id,
    spreadsheet: { matrix },
  } = spreadsheetEntity

  return (
    <section className='table-wrapper'>
      <table key={id}>
        <thead>
          <tr>
            {getColumnsHeaderLabels(matrix[0]?.length).map((columLabel, y) => (
              <th key={columLabel} onClick={selectColumn(y)}>
                <div>
                  <RemoveCellsIcon
                    isHidden={y < 1}
                    onClick={removeColumn(y - 1)}
                    isVertical
                  />
                  {columLabel}
                </div>
                <AddCellsIcon onClick={addColumn(y)} isVertical />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix?.map((row, x) => (
            <tr key={x}>
              <th onClick={selectRow(x)}>
                <AddCellsIcon
                  onClick={addRow(x)}
                  isHorizontal
                  isHidden={x > 0}
                />
                <AddCellsIcon onClick={addRow(x + 1)} isHorizontal />
                <div>
                  <RemoveCellsIcon isHorizontal onClick={removeRow(x)} />
                  {x + 1}
                </div>
              </th>
              {row.map((cell, y) => (
                <Cell key={cell.id} cellValues={cell} x={x} y={y} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default SpreadSheet
