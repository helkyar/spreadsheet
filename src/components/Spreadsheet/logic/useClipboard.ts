import { parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'
import {
  addTextToCellValues,
  formatCellValuesToText,
  updateSelectedCellsValues,
} from '@/components/Spreadsheet/logic/cellUtils'
import { useEffect } from 'react'

export const useClipboard = (selectedElements: NodeListOf<HTMLCell>) => {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      if (!selectedElements) return

      // TO_DO: should be available as copy option (contextual menu)
      const copyPlainText = false
      const result = formatCellValuesToText(selectedElements, copyPlainText)

      event.clipboardData?.setData('text/plain', result)
      event.preventDefault()
    }

    document.addEventListener('copy', copy)
    return () => document.removeEventListener('copy', copy)
  }, [selectedElements])

  useEffect(() => {
    const paste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData?.getData('text/plain')
      if (!clipboardData) return

      const element = document.activeElement as HTMLCell
      if (element.tagName !== parentTag) return

      addTextToCellValues(clipboardData, element)

      element.focus()
    }

    document.addEventListener('paste', paste)
    return () => document.removeEventListener('paste', paste)
  }, [selectedElements])

  useEffect(() => {
    const cut = (event: ClipboardEvent) => {
      if (!selectedElements) return

      // TO_DO: should be available as cut option (contextual menu)
      const copyPlainText = false
      const result = formatCellValuesToText(selectedElements, copyPlainText)
      const element = document.activeElement as HTMLCell

      updateSelectedCellsValues('', element, selectedElements)

      event.clipboardData?.setData('text/plain', result)
      event.preventDefault()
    }

    document.addEventListener('cut', cut)
    return () => document.removeEventListener('cut', cut)
  }, [selectedElements])
}
