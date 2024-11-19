import { Cell } from '@/components/Spreadsheet/components/Cell'
import { CellHeader } from '@/components/Spreadsheet/components/CellHeader'
import { Matrix } from '@/context/matrix/data/types'

type PropTypes = {
  matrix: Matrix
}

export function TableBody({ matrix }: PropTypes) {
  return (
    <tbody>
      {matrix?.map((row, x) => (
        <tr key={x}>
          <CellHeader label={x + 1} row index={x} />

          {row.map((cell, y) => (
            <Cell key={cell.id} cellValues={cell} x={x} y={y} />
          ))}
        </tr>
      ))}
    </tbody>
  )
}
