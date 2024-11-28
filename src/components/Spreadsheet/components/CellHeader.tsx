import { selector } from '@/components/ContextualMenu/data/constants'
import { menuBtnName } from '@/components/Spreadsheet/data/constants'

type PropTypes = {
  readonly label: string | number
  readonly x: number
  readonly y: number
}

export function CellHeader({ label, x, y }: PropTypes) {
  const col = x === -1
  const row = y === -1
  const firstColumnCell = y === 0

  return (
    <th tabIndex={0} data-x={x} data-y={y}>
      {!firstColumnCell && (
        <button
          name={menuBtnName}
          className={`${col && 'col'} ${
            row && 'row'
          } flex-center header-${selector}`}
        >
          {label}
        </button>
      )}
    </th>
  )
}
