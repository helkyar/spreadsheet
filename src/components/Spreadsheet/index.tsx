import Cell from '@/components/Spreadsheet/components/Cell'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { useTableEvents } from './logic/useTableEvents'
import { useMatrix } from '@/context/matrix/MatrixProvider'

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
              {y > 0 && (
                <span className='remove-column' onClick={removeColumn(y - 1)} />
              )}
              {columLabel}
              <span className='add-column' onClick={addColumn(y)} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix?.map((row, x) => (
          <tr key={x}>
            <th onClick={selectRow(x)}>
              {x === 0 && (
                <span className='add-row-first' onClick={addRow(x)} />
              )}
              <span className='add-row' onClick={addRow(x + 1)} />
              {x + 1}
              <span className='remove-row' onClick={removeRow(x)} />
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
