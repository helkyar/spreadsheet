import { parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'

import { useCallback, useEffect, useRef } from 'react'

export function useMouse(
  selectedElements: NodeListOf<HTMLCell>,
  addSelectionArea: (elFirst: HTMLCell, el: HTMLCell) => void,
  removeSelection: () => void
) {
  const firstElement = useRef<HTMLCell | null>(null)
  const isDrag = useRef<boolean>(false)

  const mouseDown = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (target.tagName !== parentTag) return

      const isTargetSelected = selectedElements
        ? Array.from(selectedElements)?.some((el) => el === target)
        : false

      if (isTargetSelected) return

      firstElement.current = target
    },
    [selectedElements]
  )

  const mouseDrag = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (!firstElement.current || target.tagName !== parentTag) return
      isDrag.current = true

      addSelectionArea(firstElement.current, target)
    },
    [addSelectionArea]
  )

  const mouseUp = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (!isDrag.current) removeSelection()
      firstElement.current = null
      isDrag.current = false
    },
    [removeSelection]
  )

  useEffect(() => {
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseDrag)
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseDrag)
      document.removeEventListener('mouseup', mouseUp)
    }
  }, [mouseDrag, mouseDown, mouseUp])
}
