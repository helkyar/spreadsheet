import {
  inputTag,
  parentTag,
  supportedFileTypes,
  textTag,
} from '@/components/Spreadsheet/data/constants'
import {
  HTMLCell,
  HTMLInput,
  HTMLText,
} from '@/components/Spreadsheet/data/types'
import { toast } from '@/components/ui/toast'
import { Matrix } from '@/context/matrix/data/types'

export const $$ = (el: string) => document.querySelectorAll(el)

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
  element.querySelector(textTag) as HTMLText

export const getText = (element: HTMLCell) => getOutput(element).innerText

export const getCurrentCellCoordinates = (element: HTMLCell) => {
  const { x: xString = -1, y: yString = -1 } = element.dataset
  const x = Number(xString)
  const y = Number(yString)
  return { x, y }
}

export const downloadTable = (id: string) => {
  const aElement = document.createElement('a')
  aElement.setAttribute('download', id + '.txt')

  const matrix = $$(parentTag) as NodeListOf<HTMLCell>
  const text = formatCellValuesToText(matrix)
  const blob = new Blob([text], { type: 'plain/text' })

  const href = URL.createObjectURL(blob)
  aElement.href = href
  aElement.setAttribute('href', href)
  aElement.setAttribute('target', '_blank')
  aElement.click()
  URL.revokeObjectURL(href)
}

export const formatCellValuesToText = (
  selectedElements: NodeListOf<HTMLCell>,
  separation: string = '\t',
  copyPlainText: boolean = false
) => {
  const selectedValues = Array.from(selectedElements).map((el) => {
    if (el.tagName !== parentTag) return
    const { x, y } = getCurrentCellCoordinates(el)
    let value = ''

    if (copyPlainText) value = getText(el)
    else value = getInput(el).value

    return { value, x, y }
  })

  // FIX_ME: try map
  const formattedValues = selectedValues.reduce((acc, curr) => {
    if (!curr) return acc
    const { value, x, y } = curr
    if (!acc[x]) acc[x] = {}
    acc[x][y] = value
    return acc
  }, {} as Record<string, Record<string, string>>)

  const result = Object.values(formattedValues)
    .map((row) => Object.values(row).join(separation))
    .join('\n')

  return result
}

export const addTextToCellValues = (
  text: string,
  initialElement?: HTMLCell
) => {
  const { x: iX = 0, y: iY = 0 } = initialElement
    ? getCurrentCellCoordinates(initialElement)
    : {}

  text.split('\n').forEach((row, x) =>
    row.split('\t').forEach((cell, y) => {
      const tableCell = getCell({ x: x + iX, y: y + iY })
      if (!tableCell) return

      const input = getInput(tableCell)
      if (!input) return

      input.value = cell
      input.focus()
      input.blur()
    })
  )
}

export const formatTextToCellValues = (text: string) => {
  const rows = text.split('\n')
  return rows.map((row) =>
    row.split('\t').map((text) => ({ inputValue: text, computedValue: text }))
  ) as Matrix
}

export const updateSelectedCellsValues = (
  value: string,
  element: HTMLCell,
  selectedElements: NodeListOf<HTMLCell>
) => {
  selectedElements.forEach((el) => {
    if (el.tagName !== parentTag) return
    const input = getInput(el)
    input.value = value
    input.focus()
    input.blur()
  })
  element?.focus()
}

export const parseFilesToMatrix = (
  files: FileList,
  createNewMatrix: (matrix: Matrix) => void
) => {
  if (!files || files.length === 0) return

  Array.from(files).forEach((file) => {
    if (!supportedFileTypes.includes(file.type)) {
      toast.error('Unsupported file type')
      return
    }

    const reader = new FileReader()
    reader.onload = (eventReader) => {
      const { result } = eventReader.target as FileReader
      const matrix = formatTextToCellValues(result as string)
      createNewMatrix(matrix)
    }

    reader.readAsText(file as Blob)
  })
}
