import { className } from '@/components/ContextualMenu/data/constants'
import { useClipboardContextMenu } from '@/components/ContextualMenu/hooks/useClipboardContextMenu'
import { useOnClickOutside } from '@/components/ContextualMenu/hooks/useOnClickOutside'
import { keyGroups } from '@/context/table/data/constants'
import { KeyboardEvent, MouseEvent } from 'react'

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

  const handleEvent = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation()
    const target = event.target as HTMLElement
    const menu = target.parentElement?.parentElement
    return menu
  }

  const handleKey = (event: KeyboardEvent) => {
    const menu = handleEvent(event)
    if (
      keyGroups.execute.includes(event.key) &&
      menu?.className.includes(className)
    ) {
      setTimeout(() => onClose(), 10)
    }
  }

  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    const menu = handleEvent(event)
    if (menu?.className.includes(className)) {
      setTimeout(() => onClose(), 10)
    }
  }

  return (
    <div
      onMouseUp={(e) => e.stopPropagation()}
      style={{ top: coords?.y, left: coords?.x }}
      className={`${className} ${row ? 'row' : ''}`}
      role='none'
    >
      <section onClick={handleClick} onKeyDown={handleKey} role='none'>
        <button onMouseDown={copyExpression} disabled={!isSelected}>
          copy expression
        </button>
        <button onMouseDown={copyValue} disabled={!isSelected}>
          copy value
        </button>
        <button onMouseDown={cutExpression} disabled={!isSelected}>
          cut expression
        </button>
        <button onMouseDown={cutValue} disabled={!isSelected}>
          cut value
        </button>

        <button onMouseDown={paste}>paste</button>
      </section>
      {children}
    </div>
  )
}
