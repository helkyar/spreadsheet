import { ContextualMenu } from '@/components/ContextualMenu'
import { useContextMenu } from '@/components/ContextualMenu/hooks/useContextMenu'
import useMountTransition from '@/logic/useMountTransition'
import { useState } from 'react'

type PropTypes = {
  readonly children: React.ReactNode
}

export function Table({ children }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)
  const isMounted = useMountTransition(openMenu)
  const { setMenuPosition, coords } = useContextMenu(() => setOpenMenu(true))
  return (
    <section
      className='table-wrapper'
      onContextMenu={setMenuPosition}
      role='application'
    >
      <table aria-label='spreadsheet'>{children}</table>

      {(openMenu || isMounted) && (
        <ContextualMenu
          className={`${isMounted && 'in'} ${openMenu && 'visible'}`}
          onClose={() => setOpenMenu(false)}
          coords={coords}
        />
      )}
    </section>
  )
}
