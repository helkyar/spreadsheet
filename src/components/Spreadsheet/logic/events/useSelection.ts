import {
  cellTag,
  drag,
  selected,
} from '@/components/Spreadsheet/data/constants'
import { HTMLCell, Selected } from '@/components/Spreadsheet/data/types'
import {
  $$,
  getCell,
  getCellCoordinates,
  getOutput,
  manageBoundaryClassName,
} from '@/components/Spreadsheet/utils/cell'
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'

export function useSelection() {
  const [selectedElements, setSelectedElements] = useState<Selected>(null)

  // toggles class to show selected cells boundaries (doted line)
  useEffect(() => {
    const { removeCellBoundary, addCellBoundary } =
      manageBoundaryClassName(selectedElements)
    if (addCellBoundary) addCellBoundary()
    return removeCellBoundary
  }, [selectedElements])

  // toggles draggable class and attribute to selected elements
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

  // selection functions
  const focusFirstSelectedElement = () => {
    const element = document.activeElement as HTMLCell
    if (element.tagName !== cellTag || !selectedElements) return

    const firstCell = selectedElements[0]
    firstCell?.focus()
  }

  const removeSelectedClass = useCallback(
    () => $$(`.${selected}`).forEach((el) => el.classList.remove(selected)),
    []
  )

  const removeSelection = useCallback(() => {
    removeSelectedClass()
    setSelectedElements(null)
  }, [removeSelectedClass])

  const addSelection = useCallback(
    (elements: Element[]) => {
      const selectedArray = Array.from(elements) as HTMLCell[]
      const hasHeader = selectedArray[0]?.tagName !== cellTag

      if (hasHeader) selectedArray.shift()
      if (selectedElements === selectedArray) return

      removeSelectedClass()

      elements.forEach((el) => el?.classList.add(selected))
      setSelectedElements(selectedArray)
      focusFirstSelectedElement()
    },
    [removeSelectedClass]
  )

  // FIX_ME: shouldn't know about the event
  const selectColumn =
    (index: number) => (event: MouseEvent | KeyboardEvent) => {
      event.stopPropagation()
      removeSelection()
      const element = event.currentTarget as Element
      const headerElements = [element, ...$$(`tr td:nth-child(${index + 1})`)]
      const allElements = [element, ...$$(cellTag)]

      if (index === 0) addSelection(allElements)
      else addSelection(headerElements)
    }

  // FIX_ME: shouldn't know about the event
  const selectRow = (index: number) => (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation()
    removeSelection()
    const element = event.currentTarget as Element
    const rowCells = $$(`tr:nth-child(${index + 1}) td`)
    addSelection([element, ...rowCells])
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

      addSelection(elementsToSelect)
    },
    [removeSelection, addSelection]
  )

  return {
    removeSelection,
    selectArea,
    selectedElements,
    selectColumn,
    selectRow,
  }
}
