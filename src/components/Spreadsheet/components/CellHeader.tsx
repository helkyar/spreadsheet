import { ContextualMenu } from '@/components/ContextualMenu'
import { useMatrix } from '@/context/matrix/useMatrix'
import { useTableEvents } from '@/context/table/useTableEvents'
import { KeyboardEvent, MouseEvent, useState } from 'react'
import { headerTag } from '@/context/table/data/constants'

type PropTypes = {
  readonly label: string | number
  readonly index: number
  readonly col?: boolean
  readonly row?: boolean
}

const eventKeys = ['Enter', 'Space']

export function CellHeader({ label, index, col, row }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)
  const [coords, setCoords] = useState<{ y?: number }>({})

  const toggleMenu = () => setOpenMenu((open) => !open)

  const { removeColumn, removeRow, addColumn, addRow } = useMatrix()
  const { selectColumn, selectRow } = useTableEvents()

  const handleRemove = col ? removeColumn : removeRow
  const indexCorrection = col ? 1 : 0

  const handleKeyDown = (event: KeyboardEvent) => {
    const element = event.target as HTMLElement
    if (eventKeys.includes(event.key) && element.tagName !== headerTag) {
      toggleMenu()
    }
    // TO_DO: select cells
  }

  const handleMouseUp = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.button === 2) toggleMenu()
    if (row) selectRow(index)(event)
    if (col) selectColumn(index)(event)
    if (event.pageY > 400) setCoords({ y: 380 - event.pageY })
  }

  if (!index && col) return <th onMouseUp={handleMouseUp} />

  let headerType = ''
  if (col) headerType = 'col'
  else if (row) headerType = 'row'
  const className = `${headerType} flex-center header-contextmenu`

  return (
    <th onMouseUp={handleMouseUp} onKeyDown={handleKeyDown} tabIndex={0}>
      <button
        onClick={() => setOpenMenu(true)}
        className={className}
        onKeyDown={handleKeyDown}
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
