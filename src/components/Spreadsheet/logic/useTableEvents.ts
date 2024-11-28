import { useClipboard } from '@/components/Spreadsheet/logic/events/useClipboard'
import { useDraggable } from '@/components/Spreadsheet/logic/events/useDraggable'
import { useKeyPress } from '@/components/Spreadsheet/logic/events/useKeyPress'
import { useMouse } from '@/components/Spreadsheet/logic/events/useMouse'
import { useSelection } from '@/components/Spreadsheet/logic/events/useSelection'
import { useMemo } from 'react'

export const useTableEvents = () => {
  const { selectedElements, ...selectors } = useSelection()
  useClipboard(selectedElements)
  useMouse({ selectedElements, ...selectors })
  useKeyPress({ selectedElements, ...selectors })
  useDraggable({ selectedElements, ...selectors })

  const value = useMemo(
    () => ({
      selectedElements,
    }),
    [selectedElements]
  )
  return value
}
