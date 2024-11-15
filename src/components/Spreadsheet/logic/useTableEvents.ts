import { useClipboard } from '@/components/Spreadsheet/logic/useClipboard'
import { useKeyPress } from '@/components/Spreadsheet/logic/useKeyPress'
import { useMouse } from '@/components/Spreadsheet/logic/useMouse'
import { useSelection } from '@/components/Spreadsheet/logic/useSelection'

export function useTableEvents() {
  const { removeSelection, addSelectionArea, selectedElements, ...selectors } =
    useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection, addSelectionArea)
  useMouse(selectedElements, addSelectionArea, removeSelection)

  return {
    ...selectors,
    removeSelection,
  }
}
