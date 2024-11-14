import { parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'
import {
  getCell,
  getCurrentCellCoordinates,
  getInput,
  getOutput,
} from '@/components/Spreadsheet/logic/cellUtils'
import { useEffect } from 'react'

const copyPlainText = false

export const useClipboard = (selectedElements: NodeListOf<HTMLCell>) => {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      if (!selectedElements) return

      const selectedValues = Array.from(selectedElements).map((el) => {
        if (el.tagName !== parentTag) return
        const { x, y } = getCurrentCellCoordinates(el)
        let value = ''

        // TO_DO: should be available as copy option (contextual menu)
        if (copyPlainText) value = getOutput(el)
        else value = getInput(el).value

        return { value, x, y }
      })

      // Array format gave copy-paste issues
      const formattedValues = selectedValues.reduce((acc, curr) => {
        if (!curr) return acc
        const { value, x, y } = curr
        if (!acc[x]) acc[x] = {}
        acc[x][y] = value
        return acc
      }, {} as Record<string, Record<string, string>>)

      const result = Object.values(formattedValues)
        .map((row) => Object.values(row).join('\t'))
        .join('\n')

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
      const { x: iX, y: iY } = getCurrentCellCoordinates(element)

      clipboardData.split('\n').forEach((row, x) =>
        row.split('\t').forEach((cell, y) => {
          const tableCell = getCell({ x: x + iX, y: y + iY })
          if (!tableCell) return

          const input = tableCell.querySelector('input') as HTMLInputElement
          if (!input) return

          input.value = cell
          input.focus()
          input.blur()
        })
      )
      element.focus()
    }

    document.addEventListener('paste', paste)
    return () => document.removeEventListener('paste', paste)
  }, [selectedElements])
}
