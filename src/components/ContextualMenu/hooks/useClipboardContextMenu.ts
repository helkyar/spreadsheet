import { useTableEvents } from '@/context/table/useTableEvents'
import { formatCellValuesToText } from '@/context/table/utils/format'

export function useClipboardContextMenu() {
  const { selectedElements } = useTableEvents()
  return {
    copyExpression: () => {
      navigator.clipboard.writeText(
        formatCellValuesToText({ elements: selectedElements })
      )
    },
    copyValue: () => {
      navigator.clipboard.writeText(
        formatCellValuesToText({
          elements: selectedElements,
          isPlainText: true,
        })
      )
    },
    cutExpression: () => {
      navigator.clipboard.writeText(
        formatCellValuesToText({ elements: selectedElements })
      )
      document.dispatchEvent(new ClipboardEvent('cut'))
    },
    cutValue: () => {
      navigator.clipboard.writeText(
        formatCellValuesToText({
          elements: selectedElements,
          isPlainText: true,
        })
      )
      document.dispatchEvent(new ClipboardEvent('cut'))
    },
    paste: () => {
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
