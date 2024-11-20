import { inputTag, outputTag, selected } from '@/context/table/data/constants'
import { HTMLCell, HTMLInput } from '@/context/table/data/types'
import { MouseEvent, useState } from 'react'

export function useContextMenu(onClick?: () => void) {
  const [isSelected, setIsSelected] = useState(false)
  const [coords, setCoords] = useState({})

  const setMenuPosition = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    const target = event.target as HTMLInput
    const cell = target.parentElement as HTMLCell
    setIsSelected(cell.classList.contains(selected))

    if (target.tagName !== inputTag) event.preventDefault()
    if (target.tagName !== outputTag) return

    //FIX_ME: magic number 515, no keyboard support
    setCoords({
      x: event.clientX,
      y: event.clientY < 515 ? event.clientY : 515,
    })
    if (onClick) onClick()
  }
  return { setMenuPosition, coords, isSelected, setCoords }
}
