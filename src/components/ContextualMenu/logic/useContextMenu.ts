import { Coords } from '@/components/ContextualMenu/data/types'
import {
  cellTag,
  headerTag,
  inputTag,
  keyGroups,
  menuBtnName,
} from '@/components/Spreadsheet/data/constants'
import { HTMLHeader, HTMLMenu } from '@/components/Spreadsheet/data/types'
import { getCellData } from '@/components/Spreadsheet/utils/cell'
import { useRef, useState } from 'react'

type Params = {
  readonly open: () => void
}

export function useContextMenu({ open }: Params) {
  const [coords, setCoords] = useState<Coords>({
    top: 'unset',
    right: 'unset',
    bottom: 'unset',
    left: 'unset',
  })

  const cellType = useRef<HTMLElement | null>(null)

  const handleOpen = () => {
    open()
    const copy = () => document.getElementsByName('copy')[0]
    setTimeout(() => copy()?.focus(), 0)
  }

  const getEventData = (event: React.MouseEvent | React.KeyboardEvent) => {
    const target = event.target as HTMLElement
    const header = target.closest(headerTag) as HTMLHeader
    const isMenu = (target as HTMLMenu).name === menuBtnName
    return { header, isMenu, target }
  }

  const setMenuPosition = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event instanceof KeyboardEvent) {
      setCoordsByKey(event as React.KeyboardEvent)
    } else {
      setCoordsByClick(event as React.MouseEvent)
    }
  }

  const setCoordsByKey = (event: React.KeyboardEvent) => {
    const { header, isMenu, target } = getEventData(event)
    if (header && isMenu && keyGroups.execute.includes(event.key)) {
      updatePositionOnTarget(header)
      return
    }
    if (target.tagName === inputTag) return
    if (event.shiftKey && keyGroups.menu.includes(event.key)) {
      event.preventDefault()
      updatePositionOnTarget(target)
    }
  }

  const setCoordsByClick = (event: React.MouseEvent) => {
    const { header, isMenu, target } = getEventData(event)

    if (event.button === 0 && !isMenu) return
    if (target.tagName === inputTag) return

    if (header) {
      updatePositionOnTarget(header)
      return
    }

    const left = event.clientX + 10
    const right = window.innerWidth - event.clientX + 10
    const top = event.clientY + 10
    const bottom = window.innerHeight - event.clientY + 10

    updateCoords(left, right, top, bottom)

    cellType.current = target.closest(cellTag)
    handleOpen()
  }

  const updatePositionOnTarget = (element: HTMLElement) => {
    // ensures that is always in screen closest to element clicked
    const size = element.getBoundingClientRect()

    const left = size.x + size.width + 10
    const right = window.innerWidth - size.x + 10
    const top = size.y + size.height + 10
    const bottom = window.innerHeight - size.y + 10

    updateCoords(left, right, top, bottom)

    cellType.current = element

    handleOpen()
  }

  function updateCoords(
    left: number,
    right: number,
    top: number,
    bottom: number
  ) {
    const { isHeader } = getCellData(cellType.current)
    const menuWidth = 200 // precise approximation
    const menuHeight = isHeader ? 700 : 350 // variable

    const maxRight = window.innerWidth - left < menuWidth
    const maxBottom = window.innerHeight - top < menuHeight
    const maxTop = top < menuHeight
    const maxLeft = left < menuWidth

    setCoords({
      right: maxRight ? right : 'unset',
      left: !maxRight ? left : 'unset',
      bottom: maxBottom ? bottom : 'unset',
      top: !maxBottom ? top : 'unset',
    })

    if (maxBottom && maxTop) {
      setCoords((coords) => ({
        ...coords,
        top: 0,
        bottom: 0,
        margin: 'auto',
      }))
    }
    if (maxLeft && maxRight) {
      setCoords((coords) => ({
        ...coords,
        left: 0,
        right: 0,
        margin: 'auto',
      }))
    }
  }
  return {
    coords,
    cellType,
    setMenuPosition,
  }
}
