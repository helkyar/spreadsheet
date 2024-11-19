import { AddIcon } from '@/components/Spreadsheet/components/ui/AddIcon'
import { MouseEvent } from 'react'

type PropTypes = {
  onClick: (e?: MouseEvent) => void
  isVertical?: boolean
  isHorizontal?: boolean
  isHidden?: boolean
}

export function AddCellsIcon({
  onClick,
  isVertical,
  isHorizontal,
  isHidden,
}: PropTypes) {
  if (isHidden) return null

  const className = isVertical ? 'add-column' : isHorizontal ? 'add-row' : ''
  const execute = ['Enter', 'Space']

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (execute.includes(e.key)) onClick()
      }}
      className={`add-icon-wrapper ${
        isVertical ? 'col' : isHorizontal ? 'row' : ''
      }`}
    >
      <AddIcon className={className} onClick={onClick} />
    </div>
  )
}
