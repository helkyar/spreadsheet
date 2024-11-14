import { inputTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell, HTMLInput } from '@/components/Spreadsheet/data/types'

export const focusCell = ({ x, y }: { x: number; y: number }) => {
  if (x < 0 || y < 0 /* || x > rows.length || y > columns.length */) return
  const cell = getCell({ x, y })
  cell?.focus()
  return cell
}

export const getCell = ({ x, y }: { x: number; y: number }) =>
  document.querySelector(`[data-x="${x}"][data-y="${y}"]`) as HTMLCell

export const getInput = (element: HTMLCell) =>
  element.querySelector(inputTag) as HTMLInput

export const getOutput = (element: HTMLCell) =>
  (element.querySelector('span') as HTMLSpanElement).innerText

export const getCurrentCellCoordinates = (element: HTMLCell) => {
  const { x: xString = -1, y: yString = -1 } = element.dataset
  const x = Number(xString)
  const y = Number(yString)
  return { x, y }
}
