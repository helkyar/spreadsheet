import { parentTag, selected } from '@/components/Spreadsheet/data/constants'
import { HTMLCell } from '@/components/Spreadsheet/data/types'
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

    const firstCell = Array.from(selectedElements).find(
      (el) => el.tagName === parentTag
    )
    firstCell?.focus()
  }, [selectedElements])

  const addSelectedClassToElements = (
    elements: HTMLElement[] | NodeListOf<Element>
  ) => {
    elements.forEach((el) => el.classList.add(selected))
  }

  const oneCellSelection = (element: HTMLElement) => {
    removeSelection()
    if (element) addSelectedClassToElements([element])
  }

  const selectColumn = (index: number) => (event: MouseEvent<HTMLElement>) => {
    if (index === 0) return //select all
    event.stopPropagation()
    oneCellSelection(event.currentTarget)

    const columCells = $$(`tr td:nth-child(${index + 1})`)
    addSelectedClassToElements(columCells)

    setSelectedElements(getSelectedElements())
  }

  const selectRow = (index: number) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    oneCellSelection(event.currentTarget)

    const rowCells = $$(`tr:nth-child(${index + 1}) td`)
    addSelectedClassToElements(rowCells)

    setSelectedElements(getSelectedElements())
  }

  return { removeSelection, selectedElements, selectColumn, selectRow }
}
