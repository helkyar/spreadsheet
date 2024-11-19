import {
  inputTag,
  outputTag,
  parentTag,
  selectedB,
  selectedL,
  selectedR,
  selectedT,
} from '@/context/table/data/constants'
import { HTMLCell, HTMLInput, HTMLText } from '@/context/table/data/types'

export const $$ = (el: string) => document.querySelectorAll(el)
export const $ = (el: string) => document.querySelector(el) as HTMLElement

export const getInput = (element: HTMLCell) =>
  element.querySelector(inputTag) as HTMLInput

export const getOutput = (element: HTMLCell) =>
  element.querySelector(outputTag) as HTMLText

export const getText = (element: HTMLCell) => getOutput(element).innerText

export const getCellCoordinates = (element: HTMLCell) => {
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

export const manageBoundaryClassName = (
  elements: NodeListOf<HTMLCell> | null,
  offset?: { x: number; y: number }
) => {
  const removeCellBoundary = () => {
    $$(`.${selectedT}`).forEach((el) => el?.classList.remove(selectedT))
    $$(`.${selectedB}`).forEach((el) => el?.classList.remove(selectedB))
    $$(`.${selectedL}`).forEach((el) => el?.classList.remove(selectedL))
    $$(`.${selectedR}`).forEach((el) => el?.classList.remove(selectedR))
  }
  if (!elements) return { removeCellBoundary }

  let topCell: HTMLCell | null = null
  let bottomCell: HTMLCell | null = null
  let leftCell: HTMLCell | null = null
  let rightCell: HTMLCell | null = null

  elements.forEach((cell) => {
    const { x, y } = getCellCoordinates(cell)

    if (!leftCell || y < getCellCoordinates(leftCell).y) {
      leftCell = cell
    }
    if (!rightCell || y > getCellCoordinates(rightCell).y) {
      rightCell = cell
    }
    if (!topCell || x < getCellCoordinates(topCell).x) {
      topCell = cell
    }
    if (!bottomCell || x > getCellCoordinates(bottomCell).x) {
      bottomCell = cell
    }
  })

  return {
    addCellBoundary: () => {
      const { x: initialX, y: initialY } = getCellCoordinates(elements[0])
      elements.forEach((cell) => {
        const { x, y } = getCellCoordinates(cell)
        let offsetCell: HTMLCell | null = null
        if (offset) {
          const { x: offsetX, y: offsetY } = offset
          offsetCell = getCell({
            x: offsetX + (x - initialX),
            y: offsetY + (y - initialY),
          })
        } else {
          offsetCell = cell
        }

        if (x === getCellCoordinates(topCell!).x) {
          offsetCell?.classList.add(selectedT)
        }
        if (x === getCellCoordinates(bottomCell!).x) {
          offsetCell?.classList.add(selectedB)
        }
        if (y === getCellCoordinates(leftCell!).y) {
          offsetCell?.classList.add(selectedL)
        }
        if (y === getCellCoordinates(rightCell!).y) {
          offsetCell?.classList.add(selectedR)
        }
      })
    },
    removeCellBoundary,
  }
}
