import {
  cellTag,
  headerTag,
  menuBtnName,
  menuTag,
  selected,
} from '@/components/Spreadsheet/data/constants'
import {
  HTMLCell,
  HTMLHeader,
  HTMLInput,
  HTMLMenu,
  Selected,
} from '@/components/Spreadsheet/data/types'
import { getCellCoordinates } from '@/components/Spreadsheet/utils/cell'
import { useEffect, useRef } from 'react'

type MouseTypes = {
  selectedElements: Selected
  selectArea: (elFirst: HTMLCell, el: HTMLCell) => void
  removeSelection: () => void
  selectColumn: (index: number, el: HTMLHeader) => void
  selectRow: (index: number, el: HTMLHeader) => void
}

export function useMouse({
  selectedElements,
  selectArea,
  removeSelection,
  selectColumn,
  selectRow,
}: MouseTypes) {
  useEffect(() => {
    const selectByHeaderClick = (element: HTMLHeader) => {
      const { x, y } = getCellCoordinates(element)
      if (x < 0 && y < 0) selectColumn(y, element)
      else if (x < 0) selectColumn(y, element)
      else if (y < 0) selectRow(x, element)
    }

    const handleClickByTagName: Record<string, (element: HTMLElement) => void> =
      {
        [headerTag]: (element: HTMLElement) => {
          selectByHeaderClick(element as HTMLHeader)
        },
        [menuTag]: (element: HTMLElement) => {
          if ((element as HTMLMenu)?.name !== menuBtnName) return
          selectByHeaderClick(element.parentElement as HTMLHeader)
        },
      }

    const handleClick = (event: MouseEvent) => {
      const element = event.target as HTMLElement
      const handler = handleClickByTagName[element?.tagName]
      if (handler) handler(element)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // dynamically selects cells when mouse is down and moving
  const firstElement = useRef<HTMLCell | null>(null)
  const isMovingAndDown = useRef<boolean>(false)

  useEffect(() => {
    const getEventData = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const cell = target.parentElement as HTMLCell
      const isCell = cell.tagName === cellTag
      const isSelected = cell.classList.contains(selected)
      const isRightClick = event.button === 2
      return { cell, isCell, isSelected, isRightClick }
    }

    const mouseDown = (event: MouseEvent) => {
      const data = getEventData(event)
      const { cell, isCell, isSelected, isRightClick } = data
      if (!isCell) removeSelection()
      if (!isCell || isSelected || isRightClick) return

      firstElement.current = cell
    }

    const mouseMove = (event: MouseEvent) => {
      const target = (event.target as HTMLInput).parentElement as HTMLCell
      if (!firstElement.current || target?.tagName !== cellTag) return
      isMovingAndDown.current = true

      selectArea(firstElement.current, target)
    }

    const mouseUp = (event: MouseEvent) => {
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
