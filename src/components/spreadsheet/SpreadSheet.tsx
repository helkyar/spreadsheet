import Cell from '@/components/spreadsheet/Cell'
import { useSpreadSheet } from '@/components/spreadsheet/logic/useSpreadSheet'

// const range = (length: number) => Array.from({ length }, (_, i) => i)

const getColumHeaderLabel = (length: number) =>
  Array.from({ length: length + 1 }, (_, i) => {
    let label = ''
    while (i > 0) {
      const remanent = i % 26
      label = String.fromCharCode(64 + remanent) + label
      i = i / 26 - 1
    }
    return label
  })

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
          {getColumHeaderLabel(cols).map((columLabel) => (
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
