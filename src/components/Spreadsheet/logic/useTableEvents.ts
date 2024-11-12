import { useClipboard } from '@/components/Spreadsheet/logic/useClipboard'
import { useKeyPress } from '@/components/Spreadsheet/logic/useKeyPress'
import { useSelection } from '@/components/Spreadsheet/logic/useSelection'

//FIX_ME: asynchronous call to ? allow React to update the DOM when multiple listeners are active for the same key
// setTimeout(() => element.parentElement.focus(), 0)

export function useTableEvents() {
  const { removeSelection, selectedElements, selectColumn, selectRow } =
    useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection)

  return {
    selectColumn,
    selectRow,
    removeSelection,
  }
}
