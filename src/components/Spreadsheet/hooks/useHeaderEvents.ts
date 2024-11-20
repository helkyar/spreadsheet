import { useMatrix } from '@/context/matrix/useMatrix'
import { keyGroups, menuTag } from '@/context/table/data/constants'
import { useTableEvents } from '@/context/table/useTableEvents'
import { KeyboardEvent, MouseEvent, useRef, useState } from 'react'

type Params = {
  readonly x: number
  readonly y: number
}

export function useHeaderEvents({ x, y }: Params) {
  const [openMenu, setOpenMenu] = useState(false)
  const row = x >= 0
  const col = y >= 0
  const coords = useRef({})

  const { removeColumn, removeRow, addColumn, addRow } = useMatrix()
  const { selectColumn, selectRow } = useTableEvents()
  const handleRemove = y >= 0 ? removeColumn : removeRow

  const index = y >= 0 ? y : x
  const indexCorrection = y >= 0 ? 1 : 0

  const handleSelection = (event: MouseEvent | KeyboardEvent) => {
    if (col) selectColumn(y)(event)
    if (row) selectRow(x)(event)
  }

  const handleMouseUp = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.button === 2) setOpenMenu(true)
    if (event.pageY > 400 && x >= 0) coords.current = { y: 380 - event.pageY }
    handleSelection(event)
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (keyGroups.execute.includes(event.key)) {
      handleSelection(event)
      const target = event.target as HTMLElement
      const isContextMenu = target.tagName === menuTag
      const positionY = target.getBoundingClientRect().y
      if (positionY > 400 && isContextMenu) {
        coords.current = { y: 380 - positionY }
      }
    }
  }

  return {
    index,
    row,
    col,
    indexCorrection,
    openMenu,
    coords,
    selectColumn,
    handleMouseUp,
    handleKeyDown,
    handleRemove,
    addColumn,
    addRow,
    setOpenMenu,
  }
}
