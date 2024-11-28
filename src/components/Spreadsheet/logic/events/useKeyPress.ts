import {
  headerTag,
  inputTag,
  keyGroups,
  menuTag,
  cellTag,
  menuBtnName,
} from '@/components/Spreadsheet/data/constants'
import {
  HTMLCell,
  HTMLHeader,
  HTMLInput,
  HTMLMenu,
  Selected,
} from '@/components/Spreadsheet/data/types'
import {
  focusCell,
  getCell,
  getCellCoordinates,
  getInput,
  updateSelectedCellsValues,
} from '@/components/Spreadsheet/utils/cell'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type TagsWithHandlers =
  | typeof headerTag
  | typeof cellTag
  | typeof inputTag
  | 'always'

const arrow = {
  down: 'ArrowDown',
  up: 'ArrowUp',
  right: 'ArrowRight',
  left: 'ArrowLeft',
}

const arrowNavigation = (
  event: KeyboardEvent,
  element: HTMLCell | HTMLHeader
) => {
  const { x, y } = getCellCoordinates(element)

  switch (event.key) {
    case arrow.down:
      const dY = x < 0 ? y - 1 : y
      return focusCell({ x: x + 1, y: dY })
    case arrow.up:
      const uY = x === 0 ? y + 1 : y
      return focusCell({ x: x - 1, y: uY })
    case arrow.right:
      return focusCell({ x, y: y + 1 })
    case arrow.left:
      return focusCell({ x, y: y - 1 })
  }
}

type KeyboardTypes = {
  selectedElements: Selected
  selectArea: (elFirst: HTMLCell, el?: HTMLCell) => void
  removeSelection: () => void
  selectByHeaderEvent: (el: HTMLHeader) => void
}

export function useKeyPress({
  selectedElements,
  selectArea,
  removeSelection,
  selectByHeaderEvent,
}: KeyboardTypes) {
  const firstSelection = useRef<HTMLCell | null>(null)

  const handleRemoveSelection = useCallback(() => {
    removeSelection()
    firstSelection.current = null
  }, [removeSelection])

  // is called every time a key is pressed
  const generalHandler = (event: KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement

    const handleTabKey = () => {
      if (selectedElements) handleRemoveSelection()
    }

    const handleEscapeKey = () => {
      if (selectedElements) handleRemoveSelection()
      const header = activeElement.closest(headerTag) as HTMLHeader
      const cell = activeElement.closest(cellTag) as HTMLCell
      header?.focus()
      cell?.focus()
    }

    const handleNavigationKey = () => {
      const cell = activeElement.closest(cellTag) as HTMLCell
      const header = activeElement.closest(headerTag) as HTMLHeader

      if (event.shiftKey) {
        handleSelectArea(event, cell as HTMLCell)
      } else {
        if (selectedElements) handleRemoveSelection()
        arrowNavigation(event, cell ?? header)
      }
    }

    const handleSelectArea = (event: KeyboardEvent, cell: HTMLCell) => {
      if (!firstSelection.current) firstSelection.current = cell
      const nextElement = arrowNavigation(event, cell)
      if (nextElement?.tagName !== headerTag) {
        selectArea(firstSelection.current, nextElement)
      } else {
        cell.focus()
      }
    }

    const handleCtrlNavigationKey = () => {
      const navigationUp = [arrow.up, arrow.right]
      const navigationDown = [arrow.down, arrow.left]

      const elements = {
        firstCell: getCell({ x: 0, y: 0 }),
        headerButton: document.querySelector('.info') as HTMLButtonElement,
        firstTab: document.querySelector('.selected-tab') as HTMLButtonElement,
      }

      const selectors = {
        isTable: activeElement.closest('table'),
        isHeader: activeElement.closest('header'),
        isTabs: activeElement
          .closest('section')
          ?.className.includes('tabs-wrapper'),
      }

      const focusElement = (element: HTMLElement | null) => element?.focus()

      if (navigationUp.includes(event.key)) {
        if (selectors.isTable) focusElement(elements.headerButton)
        else if (selectors.isHeader) focusElement(elements.firstTab)
        else focusElement(elements.firstCell)
      }
      if (navigationDown.includes(event.key)) {
        if (selectors.isTable) focusElement(elements.firstTab)
        else if (selectors.isTabs) focusElement(elements.headerButton)
        else focusElement(elements.firstCell)
      }
    }

    if (keyGroups.tab.includes(event.key)) {
      handleTabKey()
      return
    }

    if (keyGroups.escape.includes(event.key)) {
      handleEscapeKey()
      return
    }

    if (keyGroups.navigation.includes(event.key)) {
      handleNavigationKey()
      return
    }

    if (keyGroups.navigation.includes(event.key) && event.ctrlKey) {
      handleCtrlNavigationKey()
    }
  }

  const inputHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLInput
    const key = event.key
    const cell = element.parentElement as HTMLCell

    const handleExecuteKey = (element: HTMLInput, cell: HTMLCell) => {
      if (!selectedElements) {
        const { x, y } = getCellCoordinates(cell)
        focusCell({ x, y })
        focusCell({ x: x + 1, y })
        return
      }
      updateSelectedCellsValues(element.value, cell, selectedElements)
    }

    if (keyGroups.execute.includes(key)) {
      handleExecuteKey(element, cell)
      return
    }
    if (keyGroups.escape.includes(key)) {
      element.parentElement!.focus()
    }
  }

  const cellHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLCell
    const key = event.key

    if (keyGroups.skip.includes(key) || event.ctrlKey) {
      return
    }

    if (keyGroups.execute.includes(key)) {
      getInput(element).focus()
      return
    }

    if (keyGroups.delete.includes(key) && selectedElements) {
      updateSelectedCellsValues('', element, selectedElements)
      return
    }

    const input = getInput(element)
    input.value = ''
    input.focus()
  }

  const headerHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLHeader
    if (keyGroups.execute.includes(event.key)) {
      selectByHeaderEvent(element)
    }
  }

  const menuHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLMenu
    if (element.name !== menuBtnName) return
    if (keyGroups.execute.includes(event.key)) {
      selectByHeaderEvent(element.parentElement as HTMLHeader)
    }
  }

  const handleKeyboardEvent: Record<
    TagsWithHandlers,
    (event: KeyboardEvent) => void
  > = useMemo(
    () => ({
      always: generalHandler,
      [inputTag]: inputHandler,
      [cellTag]: cellHandler,
      [headerTag]: headerHandler,
      [menuTag]: menuHandler,
    }),
    [handleRemoveSelection, selectedElements, selectArea]
  )

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (!document.activeElement) return

      handleKeyboardEvent.always(event)

      const activeElement = document.activeElement.tagName as TagsWithHandlers
      const handleEvent = handleKeyboardEvent[activeElement]
      if (handleEvent) handleEvent(event)
    }

    document.addEventListener('keydown', keyDown)
    return () => document.removeEventListener('keydown', keyDown)
  }, [handleKeyboardEvent])
}
