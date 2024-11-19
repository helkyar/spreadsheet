// import { ContextualMenu } from '@/components/ContextualMenu'
// import { MouseEvent, useState } from 'react'

import { MouseEvent } from 'react'

type PropTypes = {
  children: React.ReactNode
}

export function Table({ children }: PropTypes) {
  // const [openMenu, setOpenMenu] = useState(false)
  const handleOnContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    // setOpenMenu((o) => !o)
    // make context menu appear at the cursor position
    // menu content should be dynamic based on the cell
  }

  return (
    <section className='table-wrapper'>
      <table onContextMenu={handleOnContextMenu} aria-label='spreadsheet'>
        {/* {openMenu && <ContextualMenu />} */}
        {children}
      </table>
    </section>
  )
}
