import {
  inputTag,
  outputTag,
  selectedB,
  selectedL,
  selectedR,
  selectedT,
} from '@/components/Spreadsheet/data/constants'
import {
  HTMLCell,
  HTMLHeader,
  HTMLInput,
  HTMLText,
  Selected,
} from '@/components/Spreadsheet/data/types'

export const $$ = (el: string) => document.querySelectorAll(el)
export const $ = (el: string) => document.querySelector(el) as HTMLElement

export const getInput = (element: HTMLCell) =>
  element?.querySelector(inputTag) as HTMLInput

export const getOutput = (element: HTMLCell) =>
  element?.querySelector(outputTag) as HTMLText

export const getText = (element: HTMLCell) => getOutput(element).innerText

export const getHeaderIndex = (element: HTMLHeader) => {
  const { i } = element.dataset
  return Number(i)
}
export const getCellCoordinates = (element: HTMLCell | HTMLHeader) => {
  const { x: xString = -1, y: yString = -1 } = element.dataset
  const x = Number(xString)
  const y = Number(yString)
  return { x, y }
}

export const getCell = ({ x, y }: { x: number; y: number }) => {
  return $(`[data-x="${x}"][data-y="${y}"]`) as HTMLCell
}

export const getCellData = (cell: HTMLElement | null) => {
  if (!cell) return { col: false, row: false, index: -1 }
  const { x, y } = getCellCoordinates(cell as HTMLCell)
  const index = x < 0 ? y : x
  const isHeader = x === -1 || y === -1

  return { col: x === -1, row: y === -1, index, isHeader }
}

export const focusCell = ({ x, y }: { x: number; y: number }) => {
  const cell = getCell({ x, y })
  cell?.focus()
  return cell
}

export const updateCell = (element: HTMLCell, value: string) => {
  const input = getInput(element)
  if (!input) return
  input.value = value
  input.focus()
  input.blur()
}

export const updateSelectedCellsValues = (
  value: string,
  element: HTMLCell,
  selectedElements: NonNullable<Selected>
) => {
  selectedElements.forEach((el) => updateCell(el, value))
  element?.focus()
}

export const manageBoundaryClassName = (
  elements: Selected,
  offset?: { x: number; y: number }
) => {
  const removeCellBoundary = () => {
    $$(`.${selectedT}`).forEach((el) => el.classList.remove(selectedT))
    $$(`.${selectedB}`).forEach((el) => el.classList.remove(selectedB))
    $$(`.${selectedL}`).forEach((el) => el.classList.remove(selectedL))
    $$(`.${selectedR}`).forEach((el) => el.classList.remove(selectedR))
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
