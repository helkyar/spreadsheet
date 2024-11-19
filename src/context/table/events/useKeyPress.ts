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

  const handleKeyboardEvent: Record<
    TagsWithHandlers,
    (event: KeyboardEvent) => void
  > = useMemo(
    () => ({
      [inputTag]: (event) => {
        const element = document.activeElement as HTMLInput
        if (keyGroups.execute.includes(event.key)) {
          const cell = element.parentElement as HTMLCell
          if (!selectedElements) {
            const { x, y } = getCellCoordinates(cell)
            // FIX_ME: double call to prevent out of bounds
            focusCell({ x, y })
            focusCell({ x: x + 1, y })
            return
          }
          updateSelectedCellsValues(element.value, cell, selectedElements)
        } else if (keyGroups.escape.includes(event.key)) {
          element.parentElement?.focus()
        } else if (keyGroups.navigation.includes(event.key)) {
          if (selectedElements) handleRemoveSelected()
          const cell = element.parentElement as HTMLCell
          arrowNavigation(event, cell)
        }
      },

      [parentTag]: (event) => {
        const element = document.activeElement as HTMLCell
        if (keyGroups.execute.includes(event.key)) {
          getInput(element)?.focus()
        } else if (keyGroups.escape.includes(event.key) && selectedElements) {
          handleRemoveSelected()
        } else if (keyGroups.delete.includes(event.key) && selectedElements) {
          updateSelectedCellsValues('', element, selectedElements)
        } else if (keyGroups.navigation.includes(event.key) && event.shiftKey) {
          if (!firstSelection.current) firstSelection.current = element
          const nextElement = arrowNavigation(event, element)
          selectArea(firstSelection.current, nextElement)
        } else if (keyGroups.navigation.includes(event.key)) {
          if (selectedElements) handleRemoveSelected()
          arrowNavigation(event, element)
        } else if (
          keyGroups.skip.includes(event.key) ||
          (event.ctrlKey && keyGroups.skipCombination.includes(event.key))
        ) {
          return
        } else {
          const input = getInput(element)
          input.value = ''
          input.focus()
        }
      },
      always: (event: KeyboardEvent) => {
        if (keyGroups.tab.includes(event.key)) {
          if (selectedElements) handleRemoveSelected()
        }
      },
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