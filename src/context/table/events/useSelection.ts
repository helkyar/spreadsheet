import { drag, parentTag, selected } from '@/context/table/data/constants'
import { HTMLCell, Selected } from '@/context/table/data/types'
import {
  $$,
  manageBoundaryClassName,
  getCell,
  getCellCoordinates,
  getOutput,
} from '@/context/table/utils/cell'

import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'

export function useSelection() {
  const [selectedElements, setSelectedElements] = useState<Selected>(null)

  useEffect(() => {
    const { removeCellBoundary, addCellBoundary } =
      manageBoundaryClassName(selectedElements)
    if (addCellBoundary) addCellBoundary()
    return removeCellBoundary
  }, [selectedElements])

  useEffect(() => {
    if (!selectedElements) return
    if (document.activeElement?.tagName === parentTag) return

    const firstCell = selectedElements[0]
    firstCell?.focus()
  }, [selectedElements])

  useEffect(() => {
    if (!selectedElements) return

    const draggedElements = selectedElements.map((el) => getOutput(el))
    const addDraggable = (elements: HTMLElement[]) => {
      elements.forEach((el) => {
        el?.classList.add(drag)
        el?.setAttribute('draggable', 'true')
      })
    }
    const removeDraggable = () => {
      $$(`.${drag}`).forEach((el) => {
        el?.classList.remove(drag)
        el?.setAttribute('draggable', 'false')
      })
    }
    addDraggable(draggedElements)
    return () => removeDraggable()
  }, [selectedElements])

  const getSelectedElements = useCallback(
    () => $$(`.${selected}`) as NodeListOf<HTMLCell>,
    []
  )

  const addSelectedClassToElements = useCallback(
    (elements: Element[]) => {
      elements.forEach((el) => el?.classList.add(selected))

      const selectedArray = Array.from(getSelectedElements())
      // const hasHeader = selectedArray[0]?.tagName !== parentTag
      const hasHeader = false
      if (hasHeader) selectedArray.shift()
      if (selectedElements === selectedArray) return

      setSelectedElements(selectedArray)
    },
    [getSelectedElements]
  )

  const removeSelection = useCallback(() => {
    getSelectedElements().forEach((el) => el.classList.remove(selected))
    setSelectedElements(null)
  }, [getSelectedElements])

  const selectColumn =
    (index: number) => (event: MouseEvent | KeyboardEvent) => {
      event.stopPropagation()
      removeSelection()
      const element = event.currentTarget as Element
      const headerElements = [element, ...$$(`tr td:nth-child(${index + 1})`)]
      const allElements = [element, ...$$(parentTag)]

      if (index === 0) addSelectedClassToElements(allElements)
      else addSelectedClassToElements(headerElements)
    }

  const selectRow = (index: number) => (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation()
    removeSelection()
    const element = event.currentTarget as Element
    const rowCells = $$(`tr:nth-child(${index + 1}) td`)
    addSelectedClassToElements([element, ...rowCells])
  }

  const selectArea = useCallback(
    (firstElement: HTMLCell, currentElement?: HTMLCell) => {
      if (!currentElement) return
      removeSelection()
      const { x: x1, y: y1 } = getCellCoordinates(firstElement)
      const { x: x2, y: y2 } = getCellCoordinates(currentElement)

      const minX = Math.min(x1, x2)
      const maxX = Math.max(x1, x2)
      const minY = Math.min(y1, y2)
      const maxY = Math.max(y1, y2)

      const elementsToSelect: HTMLElement[] = []

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const element = getCell({ x, y })
          if (element) elementsToSelect.push(element)
        }
      }

      addSelectedClassToElements(elementsToSelect)
    },
    [removeSelection, addSelectedClassToElements]
  )

  return {
    removeSelection,
    selectArea,
    selectedElements,
    selectColumn,
    selectRow,
  }
}
