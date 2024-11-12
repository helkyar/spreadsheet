import SpreadSheet from '@/components/Spreadsheet'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, expect, it } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'
import { inputTag, parentTag } from '@/components/Spreadsheet/data/constants'

describe('useTableEvents hook tested through ui', () => {
  const activeElement = () => document.activeElement as HTMLElement
  const selectedCells = () => document.querySelectorAll('.selected')

  beforeAll(() => {
    render(
      <MatrixProvider rows={10} cols={10}>
        <SpreadSheet />
      </MatrixProvider>
    )
  })
  it('should select column on column header click', () => {
    fireEvent.click(screen.getByText('A'))
    screen.getByText('A').click()
    expect(selectedCells().length).toBe(11)

    // multiple clicks only select one column
    fireEvent.click(screen.getByText('B'))
    fireEvent.click(screen.getByText('C'))
    expect(selectedCells().length).toBe(11)
  })

  it('should select row on row header click', () => {
    fireEvent.click(screen.getByText('1'))
    expect(selectedCells().length).toBe(11)

    // multiple clicks only select one row
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('3'))
    expect(selectedCells().length).toBe(11)
  })

  it('should update all selected cells values on write and Enter', async () => {
    const row = screen.getByText('A')

    fireEvent.click(row)
    fireEvent.keyDown(document, { key: 'Enter' })
    const isInputFocused = activeElement()?.tagName === inputTag
    expect(isInputFocused).toBe(true)
    fireEvent.keyDown(document, { key: 'c' })
    fireEvent.keyDown(document, { key: 'Enter' })
    // expect(screen.getAllByText('c').length).toBe(10)
  })

  it('should copy selected cells values to clipboard', async () => {
    fireEvent.copy(document)

    const clipboardData = await navigator.clipboard.readText()
    console.log('🚀 ~ it ~ clipboardData:', clipboardData)
    // expect(clipboardData).toBe('c\n'.repeat(10))
  })

  it('should delete all cells values on delete', async () => {
    expect(selectedCells().length).toBe(11)

    // expect(screen.getAllByText('c').length).toBe(10)

    fireEvent.keyDown(document, { key: 'Backspace' })
    expect(screen.queryAllByText('c').length).toBe(0)
  })

  it('should paste clipboard values to selected cells', () => {
    // TO_DO: implement feature
  })

  it('should select input on Enter and the cell below if pressed again', () => {
    fireEvent.keyDown(document, { key: 'Escape' })
    const cell = document.getElementsByTagName(parentTag)[0] as HTMLElement

    fireEvent.click(cell)
    const isCellFocused = () => activeElement()?.tagName === parentTag
    expect(isCellFocused()).toBe(true)

    fireEvent.keyDown(document, { key: 'Enter' })
    const isInputFocused = activeElement()?.tagName === inputTag
    expect(isInputFocused).toBe(true)

    fireEvent.keyDown(document, { key: 'Enter' })
    expect(isCellFocused()).toBe(true)
    const { x: prevX = -1, y: prevY = -1 } = cell.dataset
    const { x: nextX = -2, y: nextY = -2 } = activeElement().dataset

    expect(Number(prevX) + 1).toBe(Number(nextX))
    expect(Number(prevY)).toBe(Number(nextY))
  })
  it('should select below cell on arrow-down key press if cell is focused', () => {
    const { x: prevX = -1, y: prevY = -1 } = activeElement().dataset
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    const { x = -1, y = -1 } = activeElement().dataset

    expect(Number(prevX) + 1).toBe(Number(x))
    expect(Number(prevY)).toBe(Number(y))
  })
  it('should select below cell on arrow-up key press if cell is focused', () => {
    const { x: prevX = -1, y: prevY = -1 } = activeElement().dataset
    fireEvent.keyDown(document, { key: 'ArrowUp' })
    const { x = -1, y = -1 } = activeElement().dataset

    expect(Number(prevX) - 1).toBe(Number(x))
    expect(Number(prevY)).toBe(Number(y))
  })
  it('should select below cell on arrow-right key press if cell is focused', () => {
    const { x: prevX = -1, y: prevY = -1 } = activeElement().dataset
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    const { x = -1, y = -1 } = activeElement().dataset

    expect(Number(prevX)).toBe(Number(x))
    expect(Number(prevY) + 1).toBe(Number(y))
  })
  it('should select below cell on arrow-left key press if cell is focused', () => {
    const { x: prevX = -1, y: prevY = -1 } = activeElement().dataset
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    const { x = -1, y = -1 } = activeElement().dataset

    expect(Number(prevX)).toBe(Number(x))
    expect(Number(prevY) - 1).toBe(Number(y))
  })
})

// certain keys remove selection
// Esc, Tab
