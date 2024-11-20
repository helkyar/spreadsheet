import { ContextualMenu } from '@/components/ContextualMenu'
import { useContextMenu } from '@/components/ContextualMenu/hooks/useContextMenu'
import { useMatrix } from '@/context/matrix/useMatrix'
import { useTableEvents } from '@/context/table/useTableEvents'
import { KeyboardEvent, MouseEvent, useState } from 'react'

type PropTypes = {
  readonly label: string | number
  readonly index: number
  readonly col?: boolean
  readonly row?: boolean
}

const eventKeys = ['Enter', 'Space']

export function CellHeader({ label, index, col, row }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)
  const { coords, setCoords } = useContextMenu()

  const toggleMenu = () => setOpenMenu((open) => !open)

  const { removeColumn, removeRow, addColumn, addRow } = useMatrix()
  const { selectColumn, selectRow } = useTableEvents()

  const handleRemove = col ? removeColumn : removeRow
  const indexCorrection = col ? 1 : 0

  const handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation()
    if (eventKeys.includes(event.key)) {
      toggleMenu()
    }
  }

  const handleMouseUp = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.button === 2) setOpenMenu(true)
    if (row) {
      selectRow(index)(event)
      if (row) if (event.pageY > 400) setCoords({ y: 380 - event.pageY })
    }
    if (col) selectColumn(index)(event)
  }

  if (!index && col) return <th onMouseUp={handleMouseUp} />

  let headerType = ''
  if (col) headerType = 'col'
  else if (row) headerType = 'row'
  const className = `${headerType} flex-center header-contextmenu`

  return (
    <th onMouseUp={handleMouseUp} tabIndex={0}>
      <button
        onKeyDown={handleKeyDown}
        onClick={() => setOpenMenu(true)}
        className={className}
      >
        {label}
      </button>

      {openMenu && (
        <ContextualMenu
          onClose={() => setOpenMenu(false)}
          row={row}
          coords={coords}
          isSelected
        >
          <section>
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
          </section>
          {/* <section>
            <button>order desc</button>
            <button>order asc</button>
          </section> */}
        </ContextualMenu>
      )}
    </th>
  )
}
