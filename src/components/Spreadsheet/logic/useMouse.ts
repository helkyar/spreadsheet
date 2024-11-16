import { parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'

import { useEffect, useRef } from 'react'

export function useMouse(
  selectedElements: NodeListOf<HTMLCell>,
  addSelectionArea: (elFirst: HTMLCell, el: HTMLCell) => void,
  removeSelection: () => void
) {
  const firstElement = useRef<HTMLCell | null>(null)
  const isMovingAndDown = useRef<boolean>(false)

  useEffect(() => {
    const mouseDown = (event: MouseEvent) => {
      event.stopPropagation()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (target.tagName !== parentTag) return

      const isTargetSelected = selectedElements
        ? Array.from(selectedElements)?.some((el) => el === target)
        : false

      if (isTargetSelected) return

      firstElement.current = target
    }

    const mouseMove = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (!firstElement.current || target.tagName !== parentTag) return
      isMovingAndDown.current = true

      addSelectionArea(firstElement.current, target)
    }

    const mouseUp = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (!isMovingAndDown.current) removeSelection()
      firstElement.current = null
      isMovingAndDown.current = false
    }

    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }
  }, [selectedElements, addSelectionArea, removeSelection])
}
