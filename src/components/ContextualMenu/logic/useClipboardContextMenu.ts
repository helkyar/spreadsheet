import { Selected } from '@/components/Spreadsheet/data/types'
import { formatCellValuesToText } from '@/components/Spreadsheet/utils/format'

export function useClipboardContextMenu(
  elements: Selected,
  origin: React.MutableRefObject<HTMLElement | null>
) {
  return {
    copyExpression: () => {
      navigator.clipboard.writeText(formatCellValuesToText({ elements }))
    },
    copyValue: () => {
      navigator.clipboard.writeText(
        formatCellValuesToText({ elements, isPlainText: true })
      )
    },
    cutExpression: () => {
      navigator.clipboard.writeText(formatCellValuesToText({ elements }))
      document.dispatchEvent(new ClipboardEvent('cut'))
    },
    cutValue: () => {
      navigator.clipboard.writeText(
        formatCellValuesToText({ elements, isPlainText: true })
      )
      document.dispatchEvent(new ClipboardEvent('cut'))
    },
    paste: () => {
      if (!elements) origin.current?.focus()
      navigator.clipboard.readText().then((text) => {
        const event = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer(),
        })
        event.clipboardData?.setData('text/plain', text)
        document.dispatchEvent(event)
      })
    },
  }
}
