import { cellTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell, Selected } from '@/components/Spreadsheet/data/types'
import { updateSelectedCellsValues } from '@/components/Spreadsheet/utils/cell'
import {
  addTextToCellValues,
  formatCellValuesToText,
} from '@/components/Spreadsheet/utils/format'
import { useEffect } from 'react'

export const useClipboard = (selectedElements: Selected) => {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      if (!selectedElements) return

      const result = formatCellValuesToText({ elements: selectedElements })

      event.clipboardData?.setData('text/plain', result)
      event.preventDefault()
    }

    const paste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData?.getData('text/plain')
      if (!clipboardData) return

      let element = document.activeElement as HTMLCell
      const isCell = element.tagName === cellTag

      if (!isCell && selectedElements) element = selectedElements[0]
      else if (!isCell) return

      addTextToCellValues(clipboardData, element)

      // FIX_ME: single responsibility
      element.focus()
    }

    const cut = (event: ClipboardEvent) => {
      if (!selectedElements) return

      const result = formatCellValuesToText({ elements: selectedElements })
      const element = document.activeElement as HTMLCell

      updateSelectedCellsValues('', element, selectedElements)

      event.clipboardData?.setData('text/plain', result)
      event.preventDefault()
    }

    document.addEventListener('copy', copy)
    document.addEventListener('paste', paste)
    document.addEventListener('cut', cut)
    return () => {
      document.removeEventListener('copy', copy)
      document.removeEventListener('paste', paste)
      document.removeEventListener('cut', cut)
    }
  }, [selectedElements])
}
