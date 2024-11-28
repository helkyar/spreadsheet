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

const allowedTagHandlers: TagsWithHandlers[] = [cellTag, inputTag, headerTag]

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

  if (event.key === arrow.down) {
    const finalY = x < 0 ? y - 1 : y // header
    return focusCell({ x: x + 1, y: finalY })
  }
  if (event.key === arrow.up) {
    const finalY = x === 0 ? y + 1 : y // header
    return focusCell({ x: x - 1, y: finalY })
  }
  if (event.key === arrow.right) {
    return focusCell({ x, y: y + 1 })
  }
  if (event.key === arrow.left) {
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
    // used to select area when shift key + arrow
    firstSelection.current = null
  }, [removeSelection])

  const generalHandler = (event: KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement

    const handleTabKey = () => {
      if (activeElement?.tagName === menuTag) return
      if (selectedElements) handleRemoveSelection()
    }

    const handleEscapeKey = () => {
      if (selectedElements) handleRemoveSelection()
      const header = activeElement.closest(headerTag) as HTMLHeader
      const cell = activeElement.closest(cellTag) as HTMLCell
      header?.focus()
      cell?.focus()
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

    if (keyGroups.navigation.includes(event.key) && event.ctrlKey) {
      handleCtrlNavigationKey()
    }
  }

  const handleNavigationKey = (
    event: KeyboardEvent,
    cell: HTMLCell | HTMLHeader
  ) => {
    if (selectedElements) handleRemoveSelection()
    arrowNavigation(event, cell)
  }

  const handleExecuteKey = (element: HTMLInput, cell: HTMLCell) => {
    if (!selectedElements) {
      const { x, y } = getCellCoordinates(cell)
      // FIX_ME: double call to prevent out of bounds
      focusCell({ x, y })
      focusCell({ x: x + 1, y })
      return
    }
    updateSelectedCellsValues(element.value, cell, selectedElements)
  }

  const inputHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLInput
    const key = event.key
    const cell = element.parentElement as HTMLCell

    if (keyGroups.execute.includes(key)) {
      handleExecuteKey(element, cell)
      return
    }
    if (keyGroups.escape.includes(key)) {
      element.parentElement!.focus()
      return
    }
    if (keyGroups.navigation.includes(key)) {
      handleNavigationKey(event, cell)
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

    if (keyGroups.navigation.includes(key)) {
      if (event.shiftKey) {
        if (!firstSelection.current) firstSelection.current = element
        const nextElement = arrowNavigation(event, element)
        selectArea(firstSelection.current, nextElement)
      } else {
        handleNavigationKey(event, element)
      }
      return
    }

    const input = getInput(element)
    input.value = ''
    input.focus()
  }

  const headerHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLHeader
    const key = event.key
    if (keyGroups.navigation.includes(key)) {
      handleNavigationKey(event, element)
      return
    }

    if (keyGroups.execute.includes(key)) {
      selectByHeaderEvent(element)
      return
    }
  }

  const menuHandler = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLMenu
    if (element.name !== menuBtnName) return
    const key = event.key
    if (keyGroups.execute.includes(key)) {
      selectByHeaderEvent(element.parentElement as HTMLHeader)
    }
  }

  const handleKeyboardEvent: Record<
    TagsWithHandlers,
    (event: KeyboardEvent) => void
  > = useMemo(
    () => ({
      [inputTag]: inputHandler,
      [cellTag]: cellHandler,
      [headerTag]: headerHandler,
      [menuTag]: menuHandler,
      always: generalHandler,
    }),
    [handleRemoveSelection, selectedElements, selectArea]
  )

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (!document.activeElement) return

      handleKeyboardEvent.always(event)

      const activeElement = document.activeElement.tagName as TagsWithHandlers
      if (!allowedTagHandlers.includes(activeElement)) return

      const handleEvent = handleKeyboardEvent[activeElement]
      handleEvent(event)
    }

    document.addEventListener('keydown', keyDown)
    return () => document.removeEventListener('keydown', keyDown)
  }, [handleKeyboardEvent])
}
