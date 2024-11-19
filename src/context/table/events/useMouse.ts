import { parentTag, selected } from '@/context/table/data/constants'
import { HTMLCell, HTMLInput, Selected } from '@/context/table/data/types'
import { useEffect, useRef } from 'react'

export function useMouse(
  selectedElements: Selected,
  selectArea: (elFirst: HTMLCell, el: HTMLCell) => void,
  removeSelection: () => void
) {
  const firstElement = useRef<HTMLCell | null>(null)
  const isMovingAndDown = useRef<boolean>(false)

  useEffect(() => {
    const getEventData = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const cell = target.parentElement as HTMLCell
      const isCell = cell.tagName === parentTag
      const isSelected = cell.classList.contains(selected)
      const isRightClick = event.button === 2
      return { cell, isCell, isSelected, isRightClick }
    }

    const mouseDown = (event: MouseEvent) => {
      event.stopPropagation()

      const data = getEventData(event)
      const { cell, isCell, isSelected, isRightClick } = data
      if (!isCell || isSelected || isRightClick) return

      firstElement.current = cell
    }
    const mouseMove = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const target = (event.target as HTMLInput).parentElement as HTMLCell
      if (!firstElement.current || target.tagName !== parentTag) return
      isMovingAndDown.current = true

      selectArea(firstElement.current, target)
    }

    const mouseUp = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const data = getEventData(event)
      const { isCell, isSelected, isRightClick } = data
      if (!isCell || (isSelected && isRightClick)) return

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
  }, [selectedElements, selectArea, removeSelection])
}
