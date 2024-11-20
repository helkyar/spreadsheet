import { className } from '@/components/ContextualMenu/data/constants'
import { useClipboardContextMenu } from '@/components/ContextualMenu/hooks/useClipboardContextMenu'
import { useOnClickOutside } from '@/components/ContextualMenu/hooks/useOnClickOutside'
import { MouseEvent } from 'react'

type PropTypes = {
  readonly row?: boolean
  readonly children?: React.ReactNode
  readonly coords?: { x?: number; y?: number }
  readonly isSelected: boolean
  readonly onClose: () => void
}

export function ContextualMenu({
  children,
  row,
  coords,
  isSelected,
  onClose,
}: PropTypes) {
  useOnClickOutside(onClose)
  const { copyExpression, copyValue, cutExpression, cutValue, paste } =
    useClipboardContextMenu()
  const handleClose = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.target as HTMLElement
    const menu = target.parentElement?.parentElement
    if (menu?.className.includes(className)) onClose()
  }

  return (
    <div
      onMouseUp={(e) => e.stopPropagation()}
      style={{ top: coords?.y, left: coords?.x }}
      className={`${className} ${row ? 'row' : ''}`}
    >
      <section onClick={handleClose} role='none'>
        <button onClick={copyExpression} disabled={!isSelected}>
          copy expression
        </button>
        <button onClick={copyValue} disabled={!isSelected}>
          copy value
        </button>
        <button onClick={cutExpression} disabled={!isSelected}>
          cut expression
        </button>
        <button onClick={cutValue} disabled={!isSelected}>
          cut value
        </button>

        <button onClick={paste}>paste</button>
      </section>
      {children}
    </div>
  )
}
