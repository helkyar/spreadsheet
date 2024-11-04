import Cell from '@/components/spreadsheet/Cell'

const range = (length: number) => Array.from({ length }, (_, i) => i)

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
        {range(rows).map((x) => (
          <tr key={x}>
            <td className='row-header'>{x + 1}</td>
            {range(cols).map((y) => (
              <Cell key={`${x}/${y}`} x={x} y={y} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SpreadSheet
