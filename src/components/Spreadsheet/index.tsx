import Cell from '@/components/Spreadsheet/components/Cell'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/logic/getColumHeaderLabel'
import { useSpreadSheet } from '@/components/Spreadsheet/logic/useSpreadSheet'

type PropTypes = {
  rows: number
  cols: number
}

function SpreadSheet({ rows, cols }: PropTypes) {
  const { matrix } = useSpreadSheet({ rows, cols })

  return (
    <table>
      <thead>
        <tr>
          {getColumnsHeaderLabels(cols).map((columLabel) => (
            <th key={columLabel}>{columLabel}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix?.map((row, x) => (
          <tr key={x}>
            <td className='row-header'>{x + 1}</td>
            {row.map((cell) => (
              <Cell key={`${cell.x}/${cell.y}`} cellValues={cell} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SpreadSheet
