import { useClipboard } from '@/components/Spreadsheet/logic/useClipboard'
import { useDraggable } from '@/components/Spreadsheet/logic/useDraggable'
import { useKeyPress } from '@/components/Spreadsheet/logic/useKeyPress'
import { useMouse } from '@/components/Spreadsheet/logic/useMouse'
import { useSelection } from '@/components/Spreadsheet/logic/useSelection'

export function useTableEvents() {
  const { removeSelection, addSelectionArea, selectedElements, ...selectors } =
    useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection, addSelectionArea)
  useMouse(selectedElements, addSelectionArea, removeSelection)
  useDraggable(selectedElements, removeSelection)

  return {
    ...selectors,
    removeSelection,
  }
}
