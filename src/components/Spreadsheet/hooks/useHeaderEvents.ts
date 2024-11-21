import { useMatrix } from '@/context/matrix/useMatrix'
import { headerTag, keyGroups, menuTag } from '@/context/table/data/constants'
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
    updatePositionOnTarget(event)
    handleSelection(event)
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (keyGroups.execute.includes(event.key)) {
      handleSelection(event)
      updatePositionOnTarget(event)
    }
  }
  const updatePositionOnTarget = (event: MouseEvent | KeyboardEvent) => {
    coords.current = {}
    const target = event.target as HTMLElement
    const isContextMenu = target.tagName === menuTag
    const isHeader = target.tagName === headerTag
    const positionY = target.getBoundingClientRect().y
    const positionX = target.getBoundingClientRect().x
    const changeX =
      window.innerHeight > 700 && positionY > window.innerHeight - 500
    const changeY =
      window.innerWidth > 600 && positionX > window.innerWidth - 400

    if (changeX && isContextMenu) coords.current = { y: -370 }

    if (changeX && isHeader) coords.current = { y: -370 }

    if (changeY && isContextMenu) coords.current = { x: -200 }

    if (changeY && isHeader) coords.current = { x: -200 }
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
