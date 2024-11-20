import { inputTag, parentTag } from '@/context/table/data/constants'
import { HTMLCell, HTMLInput, Selected } from '@/context/table/data/types'
import {
  focusCell,
  getCellCoordinates,
  getInput,
  updateSelectedCellsValues,
} from '@/context/table/utils/cell'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type TagsWithHandlers = typeof parentTag | typeof inputTag | 'always'

const allowedTagHandlers: TagsWithHandlers[] = [parentTag, inputTag]

const keyGroups = {
  skip: ['Control', 'Alt', 'Shift', 'Escape', 'Tab'],
  skipCombination: ['c', 'C', 'z', 'Z', 'v', 'V', 'x', 'X'],
  escape: ['Escape'],
  delete: ['Backspace', 'Delete'],
  navigation: ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'],
  execute: ['Enter'],
  tab: ['Tab'],
}

const arrowNavigation = (event: KeyboardEvent, element: HTMLCell) => {
  const { x, y } = getCellCoordinates(element)

  if (event.key === 'ArrowDown') {
    return focusCell({ x: x + 1, y })
  }
  if (event.key === 'ArrowUp') {
    return focusCell({ x: x - 1, y })
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
    if (keyGroups.tab.includes(event.key)) {
      if (selectedElements) handleRemoveSelected()
    }
  }

  const handleNavigationKey = (event: KeyboardEvent, cell: HTMLCell) => {
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

    if (
      keyGroups.skip.includes(key) ||
      (event.ctrlKey && keyGroups.skipCombination.includes(key))
    ) {
      return
    }

    if (keyGroups.execute.includes(key)) {
      getInput(element).focus()
      return
    }

    if (keyGroups.escape.includes(key) && selectedElements) {
      handleRemoveSelected()
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

  const handleKeyboardEvent: Record<
    TagsWithHandlers,
    (event: KeyboardEvent) => void
  > = useMemo(
    () => ({
      [inputTag]: inputHandler,
      [parentTag]: cellHandler,
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
