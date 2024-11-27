import { useClipboard } from '@/components/Spreadsheet/logic/events/useClipboard'
import { useDraggable } from '@/components/Spreadsheet/logic/events/useDraggable'
import { useKeyPress } from '@/components/Spreadsheet/logic/events/useKeyPress'
import { useMouse } from '@/components/Spreadsheet/logic/events/useMouse'
import { useSelection } from '@/components/Spreadsheet/logic/events/useSelection'
import { useMemo } from 'react'

export const useTableEvents = () => {
  const { removeSelection, selectArea, selectedElements, ...selectors } =
    useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection, selectArea)
  useMouse(selectedElements, selectArea, removeSelection)
  useDraggable(selectedElements, removeSelection)
  const { selectColumn, selectRow } = selectors

  const value = useMemo(
    () => ({
      selectColumn,
      selectRow,
      removeSelection,
      selectedElements,
    }),
    [selectColumn, selectRow, removeSelection, selectedElements]
  )
  return value
}
