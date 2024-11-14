import { parentTag, selected } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'
import {
  getCell,
  getCurrentCellCoordinates,
} from '@/components/Spreadsheet/logic/cellUtils'
import { MouseEvent, useCallback, useEffect, useState } from 'react'

export function useSelection() {
  const $$ = (el: string) => document.querySelectorAll(el)
  const getSelectedElements = useCallback(
    () => $$(`.${selected}`) as NodeListOf<HTMLCell>,
    []
  )

  const [selectedElements, setSelectedElements] = useState<
    NodeListOf<HTMLCell>
  >(null as unknown as NodeListOf<HTMLCell>)

  const removeSelection = useCallback(() => {
    selectedElements?.forEach((el) => el.classList.remove(selected))
    setSelectedElements(null as unknown as NodeListOf<HTMLCell>)
  }, [selectedElements])

  useEffect(() => {
    if (!selectedElements) return
    if (document.activeElement?.tagName === parentTag) return

    const firstCell = Array.from(selectedElements).find(
      (el) => el.tagName === parentTag
    )
    firstCell?.focus()
  }, [selectedElements])

  const addSelectedClassToElements = async (
    elements: HTMLElement[] | NodeListOf<Element>
  ) => {
    elements.forEach((el) => el.classList.add(selected))
  }

  const headerCellSelection = (element: HTMLElement) => {
    removeSelection()
    if (element) addSelectedClassToElements([element])
  }

  const selectColumn = (index: number) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    headerCellSelection(event.currentTarget)

    if (index === 0) addSelectedClassToElements($$(parentTag))
    else addSelectedClassToElements($$(`tr td:nth-child(${index + 1})`))

    setSelectedElements(getSelectedElements())
  }

  const selectRow = (index: number) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    headerCellSelection(event.currentTarget)

    const rowCells = $$(`tr:nth-child(${index + 1}) td`)
    addSelectedClassToElements(rowCells)

    setSelectedElements(getSelectedElements())
  }

  const addSelectionArea = (
    firstElement: HTMLCell,
    currentElement?: HTMLCell
  ) => {
    if (!currentElement) return
    removeSelection()
    const { x: x1, y: y1 } = getCurrentCellCoordinates(firstElement)
    const { x: x2, y: y2 } = getCurrentCellCoordinates(currentElement)

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

    setSelectedElements(getSelectedElements())
  }

  return {
    removeSelection,
    addSelectionArea,
    selectedElements,
    selectColumn,
    selectRow,
  }
}
