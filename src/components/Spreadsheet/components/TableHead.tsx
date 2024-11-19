import { CellHeader } from '@/components/Spreadsheet/components/CellHeader'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/utils/columnLabel'
import { MouseEvent } from 'react'

type PropTypes = {
  length: number
  onClick: (y: number) => (e: MouseEvent<HTMLElement>) => void
}

export function TableHead({ length, onClick }: PropTypes) {
  return (
    <thead>
      <tr>
        {getColumnsHeaderLabels(length).map((columLabel, y) => (
          <th key={columLabel} onMouseDown={onClick(y)}>
            <CellHeader label={columLabel} index={y} col />
          </th>
        ))}
      </tr>
    </thead>
  )
}
