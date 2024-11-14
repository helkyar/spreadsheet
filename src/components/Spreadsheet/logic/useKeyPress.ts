import { inputTag, parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell, HTMLInput } from '@/components/Spreadsheet/data/types'
import {
  focusCell,
  getCurrentCellCoordinates,
  getInput,
} from '@/components/Spreadsheet/logic/cellUtils'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type TagsWithHandlers = typeof parentTag | typeof inputTag

const allowedTagHandlers: TagsWithHandlers[] = [parentTag, inputTag]

const keyGroups = {
  skip: ['Control', 'Alt', 'Shift', 'Escape', 'Tab'],
  skipCombination: ['c', 'C', 'z', 'Z', 'v', 'V'],
  escape: ['Escape'],
  delete: ['Backspace', 'Delete'],
  navigation: ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'],
  execute: ['Enter'],
  tab: ['Tab'],
}

const arrowNavigation = (event: KeyboardEvent, element: HTMLCell) => {
  const { x, y } = getCurrentCellCoordinates(element)

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
  selectedElements: NodeListOf<HTMLCell>,
  removeSelected: () => void,
  addSelectionArea: (elFirst: HTMLCell, el: HTMLCell | undefined) => void
) {
  const updateSelectedCellsValues = useCallback(
    (value: string, element: HTMLCell | null) => {
      selectedElements.forEach((el) => {
        if (el.tagName !== parentTag) return
        const input = getInput(el)
        input.value = value
        input.focus()
        input.blur()
      })
      element?.focus()
    },
    [selectedElements]
  )

  const firstSelection = useRef<HTMLCell | null>(null)
  const handleRemoveSelected = useCallback(() => {
    removeSelected()
    firstSelection.current = null
  }, [removeSelected])

  const eventHandlerByActiveElement: Record<
    typeof parentTag | typeof inputTag,
    (event: KeyboardEvent) => void
  > = useMemo(
    () => ({
      [inputTag]: (event) => {
        const element = document.activeElement as HTMLInput

        if (keyGroups.execute.includes(event.key)) {
          const tableCell = element.parentElement as HTMLCell
          if (selectedElements) {
            updateSelectedCellsValues(element.value, tableCell)
            return
          }
          const { x, y } = getCurrentCellCoordinates(tableCell)
          // FIX_ME: double call to prevent out of bounds
          focusCell({ x, y })
          focusCell({ x: x + 1, y })
        } else if (keyGroups.escape.includes(event.key)) {
          element.parentElement?.focus()
        }
      },
      [parentTag]: (event) => {
        const element = document.activeElement as HTMLCell

        if (keyGroups.execute.includes(event.key)) {
          getInput(element)?.focus()
        } else if (keyGroups.escape.includes(event.key) && selectedElements) {
          handleRemoveSelected()
        } else if (keyGroups.delete.includes(event.key) && selectedElements) {
          updateSelectedCellsValues('', element)
        } else if (keyGroups.navigation.includes(event.key) && event.shiftKey) {
          if (!firstSelection.current) firstSelection.current = element
          const nextElement = arrowNavigation(event, element)
          addSelectionArea(firstSelection.current, nextElement)
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
    }),
    [
      handleRemoveSelected,
      selectedElements,
      updateSelectedCellsValues,
      addSelectionArea,
    ]
  )

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (!document.activeElement) return

      if (selectedElements) {
        if (keyGroups.tab.includes(event.key)) {
          handleRemoveSelected()
        }
      }
      const activeElement = document.activeElement.tagName as TagsWithHandlers
      if (!allowedTagHandlers.includes(activeElement)) return

      const handleEvent = eventHandlerByActiveElement[activeElement]
      handleEvent(event)
    }

    document.addEventListener('keydown', keyDown)
    return () => document.removeEventListener('keydown', keyDown)
  }, [eventHandlerByActiveElement, handleRemoveSelected, selectedElements])
}
