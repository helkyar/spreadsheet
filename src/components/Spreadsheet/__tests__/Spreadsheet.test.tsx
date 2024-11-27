import { SpreadSheet } from '@/components/Spreadsheet'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, expect, it } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'
import { parentTag } from '@/components/Spreadsheet/data/constants'
import { Toaster } from '@/components/ui/toast'

const selectedClassName = 'selected-tab'

describe('Spreadsheet component with context', () => {
  beforeAll(() => {
    render(
      <MatrixProvider rows={10} cols={10}>
        <SpreadSheet />
        <Toaster />
      </MatrixProvider>
    )
  })

  it('should render the component with specified parameters from matrix', () => {
    expect(screen.getAllByText(/[A-J]/).length).toBe(10)
    // 10 rows + 1 sheet name
    expect(screen.getAllByText(/\d{1,2}/).length).toBe(11)
    expect(document.getElementsByTagName(parentTag).length).toBe(100)
    expect(screen.queryByText('K')).toBeFalsy()
    expect(screen.queryByText('0')).toBeFalsy()
    expect(screen.queryByText('11')).toBeFalsy()
  })
  it('should allow tab creation', async () => {
    // const activeElement = () => document.activeElement as HTMLElement

    // modify cell values & check that they are filled
    // fireEvent.click(screen.getByText('A'))
    // fireEvent.keyDown(document, { key: 'Enter' })
    // fireEvent.change(activeElement(), { target: { value: 'c' } })
    // fireEvent.keyDown(document, { key: 'Enter' })

    // await new Promise((resolve) => setTimeout(resolve, 50))
    // expect(screen.getAllByText('c').length).toBe(10)

    // check tab values
    expect(screen.getByText('Sheet 1')).toBeTruthy()
    // expect(screen.queryByText('Sheet 2')).toBeFalsy()

    const create = screen.getByText('+')
    fireEvent.click(create)

    expect(screen.getByText('Sheet 2')).toBeTruthy()
    expect(screen.getAllByText(/Sheet/).length).toBe(2)
    expect(screen.queryAllByText('c').length).toBe(0)
  })
  it('should allow tab change', () => {
    expect(screen.getByText('Sheet 2').className).toContain(selectedClassName)
    expect(screen.getByText('Sheet 1').className).not.toContain(
      selectedClassName
    )
    expect(screen.queryAllByText('c').length).toBe(0)

    fireEvent.click(screen.getByText('Sheet 1'))
    expect(screen.getByText('Sheet 2').className).not.toContain(
      selectedClassName
    )
    expect(screen.getByText('Sheet 1').className).toContain(selectedClassName)
    // expect(screen.getAllByText('c').length).toBe(10)
  })
  it('should allow tab deletion', () => {
    const removeButton = document.getElementsByClassName('remove-tab')[1]

    expect(screen.getByText('Sheet 2')).toBeTruthy()
    fireEvent.click(removeButton)
    expect(screen.queryByText('Sheet 2')).toBeFalsy()
  })
})
