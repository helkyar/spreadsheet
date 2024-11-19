import { outputTag, selected } from '@/context/table/data/constants'
import { HTMLCell, HTMLInput } from '@/context/table/data/types'
import { MouseEvent, useState } from 'react'

export function useContextMenu(onClick: () => void) {
  const [isSelected, setIsSelected] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const setMenuPosition = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    const target = event.target as HTMLInput
    const cell = target.parentElement as HTMLCell
    setIsSelected(cell.classList.contains(selected))
    if (target.tagName !== outputTag) return

    setCoords({ x: event.clientX, y: event.clientY })
    onClick()
    event.preventDefault()
  }
  return { setMenuPosition, coords, isSelected }
}
