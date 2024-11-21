import {
  headerTag,
  inputTag,
  keyGroups,
  menuTag,
  parentTag,
} from '@/context/table/data/constants'
import {
  HTMLCell,
  HTMLHeader,
  HTMLInput,
  Selected,
} from '@/context/table/data/types'
import {
  focusCell,
  getCell,
  getCellCoordinates,
  getInput,
  updateSelectedCellsValues,
} from '@/context/table/utils/cell'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type TagsWithHandlers =
  | typeof headerTag
  | typeof parentTag
  | typeof inputTag
  | 'always'

const allowedTagHandlers: TagsWithHandlers[] = [parentTag, inputTag, headerTag]

const arrowNavigation = (
  event: KeyboardEvent,
  element: HTMLCell | HTMLHeader
) => {
  const { x, y } = getCellCoordinates(element)

  if (event.key === 'ArrowDown') {
    const finalY = x < 0 ? y - 1 : y // header
    return focusCell({ x: x + 1, y: finalY })
  }
  if (event.key === 'ArrowUp') {
    const finalY = x === 0 ? y + 1 : y // header
    return focusCell({ x: x - 1, y: finalY })
  }
  if (event.key === 'ArrowRight') {
    return focusCell({ x, y: y + 1 })
  }
  if (event.key === 'ArrowLeft') {
    return focusCell({ x, y: y - 1 })
  }
}

export function useKeyPress(
  selectedElements: Selected,
  removeSelected: () => void,
  selectArea: (elFirst: HTMLCell, el: HTMLCell | undefined) => void
) {
  const firstSelection = useRef<HTMLCell | null>(null)
  const handleRemoveSelected = useCallback(() => {
    removeSelected()
    firstSelection.current = null
  }, [removeSelected])
  const generalHandler = (event: KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement

    const handleTabKey = () => {
      if (activeElement?.tagName === menuTag) return
      if (selectedElements) handleRemoveSelected()
    }

    const handleEscapeKey = () => {
      if (selectedElements) handleRemoveSelected()
      const header = activeElement.closest(headerTag) as HTMLHeader
      const cell = activeElement.closest(parentTag) as HTMLCell
      header?.focus()
      cell?.focus()
    }

    const handleCtrlNavigationKey = () => {
      const navigationUp = ['ArrowUp', 'ArrowRight']
      const navigationDown = ['ArrowDown', 'ArrowLeft']

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
    if (selectedElements) handleRemoveSelected()
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
    }
  }

  const handleKeyboardEvent: Record<
    TagsWithHandlers,
    (event: KeyboardEvent) => void
  > = useMemo(
    () => ({
      [inputTag]: inputHandler,
      [parentTag]: cellHandler,
      [headerTag]: headerHandler,
      always: generalHandler,
    }),
    [handleRemoveSelected, selectedElements, selectArea]
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
