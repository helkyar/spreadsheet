import { firstBtnName } from '@/components/ContextualMenu/data/constants'
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
import { debounce } from '@/components/Spreadsheet/utils/debounce'
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

  const origin = useRef<HTMLElement | null>(null)

  const handleOpen = () => {
    open()
    // wait for dom to load
    debounce(() => document.getElementsByName(firstBtnName)[0]?.focus())
  }

  const getEventData = (event: React.MouseEvent | React.KeyboardEvent) => {
    const target = event.target as HTMLElement
    const header = target.closest(headerTag) as HTMLHeader
    const isMenu = (target as HTMLMenu).name === menuBtnName
    const isInput = target.tagName === inputTag
    return { header, isMenu, target, isInput }
  }
  const getMouseEventData = (event: React.MouseEvent) => {
    const isLeftClick = event.button === 0
    return { isLeftClick, ...getEventData(event) }
  }

  const setMenuPosition = (event: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in event) setCoordsByKey(event)
    else setCoordsByClick(event)
  }

  const setCoordsByKey = (event: React.KeyboardEvent) => {
    const { execute, menu } = keyGroups
    const { header, isMenu, target, isInput } = getEventData(event)

    if (header && isMenu && execute.includes(event.key)) {
      updatePositionOnTarget(header)
      origin.current = header
      return
    }

    if (!isInput && event.shiftKey && menu.includes(event.key)) {
      event.preventDefault() // prevent browser contextual menu
      updatePositionOnTarget(target)
      origin.current = target
    }
  }

  const setCoordsByClick = (event: React.MouseEvent) => {
    const data = getMouseEventData(event)
    const { header, isMenu, target, isInput, isLeftClick } = data

    if (isInput || (isLeftClick && !isMenu)) return

    if (header) {
      updatePositionOnTarget(header)
      origin.current = header
    } else {
      const left = event.clientX + 10
      const right = window.innerWidth - event.clientX + 10
      const top = event.clientY + 10
      const bottom = window.innerHeight - event.clientY + 10

      updateCoords(left, right, top, bottom)
      origin.current = target.closest(cellTag)
    }
  }

  const updatePositionOnTarget = (element: HTMLElement) => {
    const size = element.getBoundingClientRect()
    const left = size.x + size.width + 10
    const right = window.innerWidth - size.x + 10
    const top = size.y + size.height + 10
    const bottom = window.innerHeight - size.y + 10

    updateCoords(left, right, top, bottom)
  }

  const updateCoords = (
    left: number,
    right: number,
    top: number,
    bottom: number
  ) => {
    const { isHeader } = getCellData(origin.current)
    const menuWidth = 200
    const menuHeight = isHeader ? 650 : 350

    const maxRight = window.innerWidth - left < menuWidth
    const maxBottom = window.innerHeight - top < menuHeight

    const newCoords: Coords = {
      right: maxRight ? right : 'unset',
      left: !maxRight ? left : 'unset',
      bottom: maxBottom ? bottom : 'unset',
      top: !maxBottom ? top : 'unset',
    }

    if (maxBottom && top < menuHeight) {
      Object.assign(newCoords, { top: 0, bottom: 0, margin: 'auto' })
    }
    if (maxRight && left < menuWidth) {
      Object.assign(newCoords, { left: 0, right: 0, margin: 'auto' })
    }

    setCoords(newCoords)
    handleOpen()
  }

  return {
    coords,
    origin,
    setMenuPosition,
  }
}
