import { ContextualMenu } from '@/components/ContextualMenu'
import { useContextMenu } from '@/components/ContextualMenu/hooks/useContextMenu'
import { useState } from 'react'

type PropTypes = {
  children: React.ReactNode
}

export function Table({ children }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)
  const { setMenuPosition, coords, isSelected } = useContextMenu(() =>
    setOpenMenu(true)
  )
  return (
    <section className='table-wrapper' onContextMenu={setMenuPosition}>
      <table aria-label='spreadsheet'>{children}</table>

      {openMenu && (
        <ContextualMenu
          onClose={() => setOpenMenu(false)}
          coords={coords}
          isSelected={isSelected}
        />
      )}
    </section>
  )
}
