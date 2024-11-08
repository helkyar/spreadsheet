import Cell from '@/components/spreadsheet/Cell'
import { getColumnsHeaderLabels } from '@/components/spreadsheet/logic/getColumHeaderLabel'
import { useSpreadSheet } from '@/components/spreadsheet/logic/useSpreadSheet'

// const range = (length: number) => Array.from({ length }, (_, i) => i)

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
