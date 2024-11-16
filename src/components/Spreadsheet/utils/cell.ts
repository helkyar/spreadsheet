import {
  inputTag,
  parentTag,
  textTag,
} from '@/components/Spreadsheet/data/constants'
import {
  HTMLCell,
  HTMLInput,
  HTMLText,
} from '@/components/Spreadsheet/data/types'

export const $$ = (el: string) => document.querySelectorAll(el)
const $ = (el: string) => document.querySelector(el)

export const getInput = (element: HTMLCell) =>
  element.querySelector(inputTag) as HTMLInput

export const getOutput = (element: HTMLCell) =>
  element.querySelector(textTag) as HTMLText

export const getText = (element: HTMLCell) => getOutput(element).innerText

export const getCurrentCellCoordinates = (element: HTMLCell) => {
  const { x: xString = -1, y: yString = -1 } = element.dataset
  const x = Number(xString)
  const y = Number(yString)
  return { x, y }
}

export const getCell = ({ x, y }: { x: number; y: number }) =>
  $(`[data-x="${x}"][data-y="${y}"]`) as HTMLCell

export const focusCell = ({ x, y }: { x: number; y: number }) => {
  if (x < 0 || y < 0 /* || x > rows.length || y > columns.length */) return
  const cell = getCell({ x, y })
  cell?.focus()
  return cell
}

export const updateCell = (element: HTMLCell, value: string) => {
  const input = getInput(element)
  input.value = value
  input.focus()
  input.blur()
}

export const updateSelectedCellsValues = (
  value: string,
  element: HTMLCell,
  selectedElements: NodeListOf<HTMLCell>
) => {
  selectedElements.forEach((el) => {
    if (el.tagName === parentTag) {
      updateCell(el, value)
    }
  })
  element?.focus()
}
