import { useOnClickOutside } from '@/components/ContextualMenu/hooks/useOnClickOutside'
import { useTableEvents } from '@/context/table/useTableEvents'
import { formatCellValuesToText } from '@/context/table/utils/format'

type PropTypes = {
  row?: boolean
  col?: boolean
  children?: React.ReactNode
  coords?: { x: number; y: number }
  isSelected: boolean
  onClose: () => void
}

export function ContextualMenu({
  children,
  row,
  coords,
  isSelected,
  onClose,
}: PropTypes) {
  useOnClickOutside(onClose)
  const { selectedElements } = useTableEvents()
  return (
    <div
      style={{ top: coords?.y, left: coords?.x }}
      className={`contextual-menu ${row ? 'row' : ''}`}
    >
      <div onClick={() => setTimeout(() => onClose(), 10)}>
        {isSelected && (
          <>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  formatCellValuesToText({ elements: selectedElements })
                )
              }
            >
              copy expression
            </button>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  formatCellValuesToText({
                    elements: selectedElements,
                    isPlainText: true,
                  })
                )
              }
            >
              copy value
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  formatCellValuesToText({ elements: selectedElements })
                )
                document.dispatchEvent(new ClipboardEvent('cut'))
              }}
            >
              cut expression
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  formatCellValuesToText({
                    elements: selectedElements,
                    isPlainText: true,
                  })
                )
                document.dispatchEvent(new ClipboardEvent('cut'))
              }}
            >
              cut value
            </button>
          </>
        )}
        <button
          onClick={() => {
            navigator.clipboard.readText().then((text) => {
              const event = new ClipboardEvent('paste', {
                clipboardData: new DataTransfer(),
              })
              event.clipboardData?.setData('text/plain', text)
              document.dispatchEvent(event)
            })
          }}
        >
          paste
        </button>
      </div>
      {children}
    </div>
  )
}
