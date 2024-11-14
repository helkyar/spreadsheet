import { useClipboard } from '@/components/Spreadsheet/logic/useClipboard'
import { useKeyPress } from '@/components/Spreadsheet/logic/useKeyPress'
import { useSelection } from '@/components/Spreadsheet/logic/useSelection'

export function useTableEvents() {
  const { removeSelection, selectedElements, ...selectors } = useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection)

  return {
    ...selectors,
    removeSelection,
  }
}
