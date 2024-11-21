import { MenuButton } from '@/components/ContextualMenu/components/MenuButton'
import { CopyIcon } from '@/components/ContextualMenu/components/ui/Copy'
import { CutIcon } from '@/components/ContextualMenu/components/ui/Cut'
import { PasteIcon } from '@/components/ContextualMenu/components/ui/PasteIcon'
import { selector } from '@/components/ContextualMenu/data/constants'
import { useClipboardContextMenu } from '@/components/ContextualMenu/hooks/useClipboardContextMenu'
import { useOnClickOutside } from '@/components/ContextualMenu/hooks/useOnClickOutside'
import { keyGroups } from '@/context/table/data/constants'
import { KeyboardEvent, MouseEvent } from 'react'

type PropTypes = {
  readonly col?: boolean
  readonly row?: boolean
  readonly children?: React.ReactNode
  readonly coords?: { x?: number; y?: number }
  readonly isSelected: boolean
  readonly onClose: () => void
  readonly className: string | boolean
}

export function ContextualMenu({
  children,
  col,
  row,
  coords,
  className,
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
      menu?.className.includes(selector)
    ) {
      onClose()
    }
  }

  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    const menu = handleEvent(event)
    if (menu?.className.includes(selector)) {
      setTimeout(() => onClose(), 10)
    }
  }

  return (
    <div
      onMouseUp={(e) => e.stopPropagation()}
      style={{ top: coords?.y, left: coords?.x }}
      className={`${selector} ${className} ${col && 'col'} ${row && 'row'}`}
      role='none'
    >
      <section onClick={handleClick} onKeyDown={handleKey} role='none'>
        <MenuButton
          label='copy expression'
          onClick={copyExpression}
          Icon={<CopyIcon />}
        />
        <MenuButton
          label='copy value'
          onClick={copyValue}
          Icon={<CopyIcon />}
        />
        <MenuButton
          label='cut expression'
          onClick={cutExpression}
          Icon={<CutIcon />}
        />
        <MenuButton label='cut value' onClick={cutValue} Icon={<CutIcon />} />
        <MenuButton label='paste' onClick={paste} Icon={<PasteIcon />} />
      </section>
      {children}
    </div>
  )
}
