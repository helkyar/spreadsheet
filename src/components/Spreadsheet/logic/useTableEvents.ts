import { useClipboard } from '@/components/Spreadsheet/logic/useClipboard'
import { useKeyPress } from '@/components/Spreadsheet/logic/useKeyPress'
import { useSelection } from '@/components/Spreadsheet/logic/useSelection'

export function useTableEvents() {
  const { removeSelection, addSelectionArea, selectedElements, ...selectors } =
    useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection, addSelectionArea)

  return {
    ...selectors,
    removeSelection,
  }
}
