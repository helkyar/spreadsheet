import { useState } from 'react'
import { useTableEvents } from '@/components/Spreadsheet/logic/useTableEvents'
import { useMountTransition } from '@/logic/useMountTransition'
import { useMenu } from '@/components/ContextualMenu/logic/useContextMenu'
import { ContextualMenu } from '@/components/ContextualMenu'
import { inputTag } from '@/components/Spreadsheet/data/constants'

type PropTypes = {
  readonly children: React.ReactNode
}

export function TableWithMenu({ children }: PropTypes) {
  const { selectedElements } = useTableEvents()

  const [openMenu, setOpenMenu] = useState(false)
  const isMounted = useMountTransition(openMenu)
  const { setPosition, coords, origin } = useMenu(() => setOpenMenu(true))

  const handleContextMenu = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === inputTag) return
    event.preventDefault()
  }

  return (
    <section
      role='none'
      className='table-wrapper'
      // listeners to determine contextual menu behavior
      onContextMenu={handleContextMenu}
      onMouseUp={setPosition}
      onKeyDown={setPosition}
    >
      <table aria-label='spreadsheet'>{children}</table>
      {(openMenu || isMounted) && (
        <ContextualMenu
          className={`${isMounted && 'in'} ${openMenu && 'visible'}`}
          onClose={() => setOpenMenu(false)}
          coords={coords}
          origin={origin}
          selectedItems={selectedElements}
        />
      )}
    </section>
  )
}
