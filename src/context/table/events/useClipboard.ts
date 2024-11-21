import { parentTag } from '@/context/table/data/constants'
import { HTMLCell, Selected } from '@/context/table/data/types'
import { updateSelectedCellsValues } from '@/context/table/utils/cell'
import {
  addTextToCellValues,
  formatCellValuesToText,
} from '@/context/table/utils/format'
import { useEffect } from 'react'

export const useClipboard = (selectedElements: Selected) => {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      console.log('🚀 ~ copy ~ selectedElements:', selectedElements)
      if (!selectedElements) return

      const result = formatCellValuesToText({ elements: selectedElements })

      event.clipboardData?.setData('text/plain', result)
      event.preventDefault()
    }

    const paste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData?.getData('text/plain')
      if (!clipboardData) return

      const element = document.activeElement as HTMLCell
      const isCell = element.tagName === parentTag

      if (!isCell && !selectedElements) return

      const cell = selectedElements![0]
      const pasteElement = element.tagName === parentTag ? element : cell

      addTextToCellValues(clipboardData, pasteElement)

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
