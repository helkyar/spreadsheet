import { Selected } from '@/components/Spreadsheet/data/types'
import { formatCellValuesToText } from '@/components/Spreadsheet/utils/format'

export function useClipboardContextMenu(elements: Selected) {
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
      console.log('🚀 ~ elements:', elements)

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
