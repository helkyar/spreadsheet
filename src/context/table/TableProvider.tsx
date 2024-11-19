import { TableContext } from '@/context/table/TableContext'
import { useClipboard } from '@/context/table/events/useClipboard'
import { useDraggable } from '@/context/table/events/useDraggable'
import { useKeyPress } from '@/context/table/events/useKeyPress'
import { useMouse } from '@/context/table/events/useMouse'
import { useSelection } from '@/context/table/events/useSelection'

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const { removeSelection, selectArea, selectedElements, ...selectors } =
    useSelection()
  useClipboard(selectedElements)
  useKeyPress(selectedElements, removeSelection, selectArea)
  useMouse(selectedElements, selectArea, removeSelection)
  useDraggable(selectedElements, removeSelection)
  const { selectColumn, selectRow } = selectors

  const value = {
    selectColumn,
    selectRow,
    removeSelection,
  }

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}
