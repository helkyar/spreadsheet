import { ContextualMenu } from '@/components/ContextualMenu'
import { useMatrix } from '@/context/matrix/useMatrix'
import { useTableEvents } from '@/context/table/useTableEvents'
import { MouseEvent, useState } from 'react'

type PropTypes = {
  label: string | number
  index: number
  col?: boolean
  row?: boolean
}

export function CellHeader({ label, index, col, row }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)

  const { removeColumn, removeRow, addColumn, addRow } = useMatrix()
  const { selectColumn, selectRow } = useTableEvents()

  const handleRemove = col ? removeColumn : removeRow
  const indexCorrection = col ? 1 : 0

  const handleMouseUp = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (row) selectRow(index)(event)
    if (col) selectColumn(index)(event)
    if ((index || row) && event.button === 2) setOpenMenu(true)
  }

  if (!index && col) return <th onMouseUp={handleMouseUp} />

  const className = `${col ? 'col' : row ? 'row' : ''} header-contextmenu`
  return (
    <th onMouseUp={handleMouseUp}>
      <div
        onClick={() => setOpenMenu(true)}
        className={`flex-center ${className}`}
      >
        {label}
      </div>

      {openMenu && (
        <ContextualMenu
          onClose={() => setOpenMenu(false)}
          row={row}
          col={col}
          isSelected
        >
          <button onClick={handleRemove(index - indexCorrection)}>
            delete
          </button>
          {col && (
            <>
              <button onClick={addColumn(index - 1)}>add left</button>
              <button onClick={addColumn(index)}>add right</button>
            </>
          )}
          {row && (
            <>
              <button onClick={addRow(index)}>add above</button>
              <button onClick={addRow(index + 1)}>add below</button>
            </>
          )}

          <button>order desc</button>
          <button>order asc</button>
        </ContextualMenu>
      )}
    </th>
  )
}
