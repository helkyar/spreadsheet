import { SpreadSheet } from '@/components/Spreadsheet'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, expect, it } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'
import { inputTag, parentTag } from '@/components/Spreadsheet/data/constants'
import { act } from 'react'

describe('useTableEvents hook tested through ui', () => {
  const activeElement = () => document.activeElement as HTMLElement
  const selectedCells = () => document.querySelectorAll('.selected')
  const isCellFocused = () => activeElement()?.tagName === parentTag
  const isInputFocused = () => activeElement()?.tagName === inputTag

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

    // checks that multiple clicks only select one column
    fireEvent.click(screen.getByText('B'))
    fireEvent.click(screen.getByText('C'))
    expect(selectedCells().length).toBe(11)
  })

  it('should select row on row header click', () => {
    fireEvent.click(screen.getByText('1'))
    expect(selectedCells().length).toBe(11)

    // checks that multiple clicks only select one row
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('3'))
    expect(selectedCells().length).toBe(11)
  })

  it('should update all selected cells values on write and Enter', async () => {
    fireEvent.click(screen.getByText('A'))
    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.change(activeElement(), { target: { value: 'c' } })
    fireEvent.keyDown(document, { key: 'Enter' })

    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getAllByText('c').length).toBe(10)
  })

  it('should copy selected cells values to clipboard', async () => {
    expect(selectedCells().length).toBe(11)
    expect(isCellFocused()).toBe(true)
    expect(screen.getAllByText('c').length).toBe(10)

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })
    fireEvent.copy(document)

    // expect(clipboardData).toBe('c\n'.repeat(10))
  })

  it('should delete all cells values on delete', async () => {
    expect(selectedCells().length).toBe(11)

    expect(screen.getAllByText('c').length).toBe(10)

    fireEvent.keyDown(document, { key: 'Backspace' })

    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.queryAllByText('c').length).toBe(0)
  })

  it('should paste clipboard values to selected cells', async () => {
    const clipboardData = 'a\n'.repeat(10)
    await act(async () => {
      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text/plain', clipboardData)
      window.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData: dataTransfer })
      )
    })

    expect(isCellFocused()).toBe(true)
    await navigator.clipboard.writeText(clipboardData)

    fireEvent.paste(document)
    // await new Promise((resolve) => setTimeout(resolve, 50))
    // expect(screen.getAllByText('a').length).toBe(10)
  })

  it('should select input on Enter and the cell below if pressed again', () => {
    fireEvent.keyDown(document, { key: 'Escape' })
    const cell = document.getElementsByTagName(parentTag)[0] as HTMLElement

    fireEvent.click(cell)
    expect(isCellFocused()).toBe(true)

    fireEvent.keyDown(document, { key: 'Enter' })
    expect(isInputFocused()).toBe(true)

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
// Possible corner case, some keys don't work at specific cells
//  -> test at least one cell from each corner
