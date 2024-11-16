import { AddCellsIcon } from '@/components/Spreadsheet/components/AddCellsIcon'
import { Cell } from '@/components/Spreadsheet/components/Cell'
import { RemoveCellsIcon } from '@/components/Spreadsheet/components/RemoveCellsIcon'
import { Matrix } from '@/context/matrix/data/types'
import { MouseEvent } from 'react'

type PropTypes = {
  matrix: Matrix
  onClick: (y: number) => (e: MouseEvent<HTMLElement>) => void
  onAdd: (y: number) => (e?: MouseEvent) => void
  onRemove: (y: number) => (e?: MouseEvent) => void
}

export function TableBody({ matrix, onClick, onAdd, onRemove }: PropTypes) {
  return (
    <tbody>
      {matrix?.map((row, x) => (
        <tr key={x}>
          <th onClick={onClick(x)}>
            <AddCellsIcon onClick={onAdd(x)} isHorizontal isHidden={x > 0} />
            <AddCellsIcon onClick={onAdd(x + 1)} isHorizontal />
            <div className='flex-center'>
              <RemoveCellsIcon isHorizontal onClick={onRemove(x)} />
              {x + 1}
            </div>
          </th>
          {row.map((cell, y) => (
            <Cell key={cell.id} cellValues={cell} x={x} y={y} />
          ))}
        </tr>
      ))}
    </tbody>
  )
}
