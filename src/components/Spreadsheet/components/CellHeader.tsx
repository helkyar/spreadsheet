import { ContextualMenu } from '@/components/ContextualMenu'
import { useOnClickOutside } from '@/components/Spreadsheet/hooks/useOnClickOutside'
import { useRef, useState } from 'react'

type PropTypes = {
  label: string | number
  index?: number
  col?: boolean
  row?: boolean
}

export function CellHeader({ label, index, col, row }: PropTypes) {
  const [openMenu, setOpenMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setOpenMenu(false))

  if (!index && col) return null

  const className = `${col ? 'col' : row ? 'row' : ''} header-contextmenu`
  return (
    <>
      <div
        ref={ref}
        onClick={() => setOpenMenu((o) => !o)}
        className={`flex-center ${className}`}
      >
        {label}
      </div>
      {openMenu && <ContextualMenu row={row} col={col} />}
    </>
  )
}
