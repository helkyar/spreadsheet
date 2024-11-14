import { parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'
import { useEffect, useRef } from 'react'

export function useMouse(
  addSelectionArea: (elFirst: HTMLCell, el: HTMLCell) => void,
  removeSelection: () => void
) {
  const firstElement = useRef<HTMLCell | null>(null)

  useEffect(() => {
    const mouseSelection = (event: MouseEvent) => {
      event.stopPropagation()
      removeSelection()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (target.tagName !== parentTag) return
      firstElement.current = target
    }
    document.addEventListener('mousedown', mouseSelection)
    return () => document.removeEventListener('mousedown', mouseSelection)
  }, [removeSelection])

  useEffect(() => {
    const mouseDrag = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (target.tagName !== parentTag) return
      if (!firstElement.current) return

      addSelectionArea(firstElement.current, target)
    }
    document.addEventListener('mousemove', mouseDrag)
    return () => document.removeEventListener('mousemove', mouseDrag)
  }, [addSelectionArea])

  useEffect(() => {
    const mouseSelection = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (firstElement.current) firstElement.current = null
    }
    document.addEventListener('mouseup', mouseSelection)
    return () => document.removeEventListener('mouseup', mouseSelection)
  }, [])
}
