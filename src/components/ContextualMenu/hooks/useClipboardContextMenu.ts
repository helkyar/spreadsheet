import { parentTag } from '@/context/table/data/constants'
import { useTableEvents } from '@/context/table/useTableEvents'
import { formatCellValuesToText } from '@/context/table/utils/format'

export function useClipboardContextMenu() {
  const { selectedElements } = useTableEvents()
  let elements = selectedElements
  if (elements && elements[0].tagName !== parentTag) {
    elements.shift()
  }
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
