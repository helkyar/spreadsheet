import { selector } from '@/components/ContextualMenu/data/constants'
import { headerName, menuName } from '@/components/Spreadsheet/data/constants'

type PropTypes = {
  readonly label: string | number
  readonly x: number
  readonly y: number
}

export function CellHeader({ label, x, y }: PropTypes) {
  const col = x === -1
  const row = y === -1

  return (
    <th tabIndex={0} data-x={x} data-y={y} aria-label={headerName}>
      <button
        aria-label={menuName}
        className={`${col && 'col'} ${
          row && 'row'
        } flex-center header-${selector}`}
      >
        {label}
      </button>
    </th>
  )
}
