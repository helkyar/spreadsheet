import Cell from '@/components/Spreadsheet/components/Cell'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { useTableEvents } from './logic/useTableEvents'
import { AddCellsIcon } from '@/components/Spreadsheet/components/AddCellsIcon'
import { RemoveCellsIcon } from '@/components/Spreadsheet/components/RemoveCellsIcon'
import { useMatrix } from '@/context/matrix/useMatrix'
// import { useMatrix } from '@/context/matrix/MatrixProvider'

function SpreadSheet() {
  const { removeSelection, selectColumn, selectRow } = useTableEvents()
  const { matrix, addRow, addColumn, removeColumn, removeRow } = useMatrix()

  // Clean inputs

  return (
    <table onClick={removeSelection}>
      <thead>
        <tr>
          {getColumnsHeaderLabels(matrix[0]?.length).map((columLabel, y) => (
            <th key={columLabel} onClick={selectColumn(y)}>
              <RemoveCellsIcon
                isHidden={y < 1}
                onClick={removeColumn(y - 1)}
                isVertical
              />
              {columLabel}
              <AddCellsIcon onClick={addColumn(y)} isVertical />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix?.map((row, x) => (
          <tr key={x}>
            <th onClick={selectRow(x)}>
              <AddCellsIcon onClick={addRow(x)} isHorizontal isHidden={x > 0} />
              <RemoveCellsIcon isHorizontal onClick={removeRow(x)} />
              <AddCellsIcon onClick={addRow(x + 1)} isHorizontal />
              {x + 1}
            </th>
            {row.map((cell) => (
              <Cell key={cell.id} cellValues={cell} selected={false} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SpreadSheet
