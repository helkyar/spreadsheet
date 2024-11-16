import { AddCellsIcon } from '@/components/Spreadsheet/components/AddCellsIcon'
import { RemoveCellsIcon } from '@/components/Spreadsheet/components/RemoveCellsIcon'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/utils/columnLabel'
import { MouseEvent } from 'react'

type PropTypes = {
  length: number
  onClick: (y: number) => (e: MouseEvent<HTMLElement>) => void
  onAdd: (y: number) => (e?: MouseEvent) => void
  onRemove: (y: number) => (e?: MouseEvent) => void
}

export function TableHead({ length, onClick, onAdd, onRemove }: PropTypes) {
  return (
    <thead>
      <tr>
        {getColumnsHeaderLabels(length).map((columLabel, y) => (
          <th key={columLabel} onClick={onClick(y)}>
            <div className='flex-center'>
              <RemoveCellsIcon
                isHidden={y < 1}
                onClick={onRemove(y - 1)}
                isVertical
              />
              {columLabel}
            </div>
            <AddCellsIcon onClick={onAdd(y)} isVertical />
          </th>
        ))}
      </tr>
    </thead>
  )
}
