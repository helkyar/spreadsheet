import { useClipboardContextMenu } from '@/components/ContextualMenu/hooks/useClipboardContextMenu'
import { useOnClickOutside } from '@/components/ContextualMenu/hooks/useOnClickOutside'

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

  console.log('ContextualMenu', coords)

  return (
    <div
      style={{ top: coords?.y, left: coords?.x }}
      className={`contextual-menu ${row ? 'row' : ''}`}
    >
      <section onClick={() => setTimeout(() => onClose(), 10)} role='none'>
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
