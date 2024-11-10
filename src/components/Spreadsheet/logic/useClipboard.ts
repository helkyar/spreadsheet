import { HTMLCell, parentTag } from '@/components/Spreadsheet/data/types'
import { useEffect } from 'react'

export const useClipboard = (selectedElements: NodeListOf<HTMLCell>) => {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      if (!selectedElements) return

      const selectedValues = Array.from(selectedElements).map((el) => {
        if (el.tagName !== parentTag) return

        const span = el.children[0] as HTMLSpanElement
        const value = span.innerText
        return value
      })

      event.clipboardData?.setData('text/plain', selectedValues.join('\n'))
      event.preventDefault()
    }

    document.addEventListener('copy', copy)
    return () => document.removeEventListener('copy', copy)
  }, [selectedElements])
}
