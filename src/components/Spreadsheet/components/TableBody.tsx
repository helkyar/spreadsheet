import { Cell } from '@/components/Spreadsheet/components/Cell'
import { CellHeader } from '@/components/Spreadsheet/components/CellHeader'
import { Matrix } from '@/context/matrix/data/types'
import { MouseEvent } from 'react'

type PropTypes = {
  matrix: Matrix
  onClick: (y: number) => (e: MouseEvent<HTMLElement>) => void
}

export function TableBody({ matrix, onClick }: PropTypes) {
  return (
    <tbody>
      {matrix?.map((row, x) => (
        <tr key={x}>
          <th onMouseDown={onClick(x)}>
            <CellHeader label={x + 1} row />
          </th>
          {row.map((cell, y) => (
            <Cell key={cell.id} cellValues={cell} x={x} y={y} />
          ))}
        </tr>
      ))}
    </tbody>
  )
}
