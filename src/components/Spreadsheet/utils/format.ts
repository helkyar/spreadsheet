import {
  HTMLCell,
  Selected,
  Separation,
} from '@/components/Spreadsheet/data/types'
import {
  getCell,
  getCellCoordinates,
  getInput,
  getText,
  updateCell,
} from '@/components/Spreadsheet/utils/cell'
import { Matrix } from '@/context/matrix/data/types'

export const formatCellValuesToText = ({
  elements,
  separation = '\t',
  isPlainText = false,
}: {
  elements: Selected
  separation?: Separation
  isPlainText?: boolean
}) => {
  if (!elements) return ''

  const selectedValues = elements.map((el) => {
    const { x, y } = getCellCoordinates(el)
    let value = ''

    if (isPlainText) value = getText(el)
    else value = getInput(el).value

    return { value, x, y }
  })

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
    ? getCellCoordinates(initialElement)
    : {}

  text.split('\n').forEach((row, x) => {
    row.split('\t').forEach((cell, y) => {
      const tableCell = getCell({ x: x + iX, y: y + iY })
      if (tableCell) {
        updateCell(tableCell, cell)
      }
    })
  })
}

export const formatTextToCellValues = (text: string) => {
  const rows = text.split('\n')
  return rows.map((row) =>
    row.split('\t').map((text) => ({ inputValue: text, computedValue: text }))
  ) as Matrix
}
