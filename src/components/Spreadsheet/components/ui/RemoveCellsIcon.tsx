import { RemoveIcon } from '@/components/Spreadsheet/components/ui/RemoveIcon'
import { MouseEvent } from 'react'

type PropTypes = {
  onClick: (e?: MouseEvent) => void
  isVertical?: boolean
  isHorizontal?: boolean
  isHidden?: boolean
}

export function RemoveCellsIcon({
  onClick,
  isVertical,
  isHidden,
  isHorizontal,
}: PropTypes) {
  if (isHidden) return null

  const className = isVertical ? 'rm-column' : isHorizontal ? 'rm-row' : ''
  const execute = ['Enter', 'Space']

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (execute.includes(e.key)) onClick()
      }}
      className={`rm-icon-wrapper ${
        isVertical ? 'col' : isHorizontal ? 'row' : ''
      }`}
    >
      <RemoveIcon className={className} onClick={onClick} />
    </div>
  )
}
