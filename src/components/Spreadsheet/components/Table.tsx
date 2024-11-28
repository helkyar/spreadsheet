import { ContextualMenu } from '@/components/ContextualMenu'
import { useContextMenu } from '@/components/ContextualMenu/logic/useContextMenu'
import { inputTag } from '@/components/Spreadsheet/data/constants'
import { useTableEvents } from '@/components/Spreadsheet/logic/useTableEvents'
import useMountTransition from '@/logic/useMountTransition'
import { useState } from 'react'

type PropTypes = {
  readonly children: React.ReactNode
}

export function Table({ children }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)
  const open = () => setOpenMenu(true)
  const close = () => setOpenMenu(false)

  const isMounted = useMountTransition(openMenu)

  const { selectedElements } = useTableEvents()
  const { setMenuPosition, coords, cellType } = useContextMenu({ open })

  const handleContextMenu = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === inputTag) return
    event.preventDefault()
  }

  return (
    <section
      className='table-wrapper'
      onContextMenu={handleContextMenu}
      onMouseUp={setMenuPosition}
      onKeyDown={setMenuPosition}
      role='application'
    >
      <table aria-label='spreadsheet'>{children}</table>
      {(openMenu || isMounted) && (
        <ContextualMenu
          className={`${isMounted && 'in'} ${openMenu && 'visible'}`}
          onClose={close}
          coords={coords}
          cellType={cellType.current}
          selectedItems={selectedElements}
        />
      )}
    </section>
  )
}
