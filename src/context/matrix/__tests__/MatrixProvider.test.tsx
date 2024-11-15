import App from '@/App'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

const selectedClassName = 'selected-tab'
describe('MatrixProvider', () => {
  beforeAll(() => {
    render(
      <MatrixProvider cols={10} rows={10}>
        <App />
      </MatrixProvider>
    )
  })
  it('should allow tab creation', () => {
    // modify cell values & check that they are filled
    // -> ...
    expect(screen.getByText('Sheet 1')).toBeTruthy()
    expect(screen.queryByText('Sheet 2')).toBeFalsy()

    const create = screen.getByText('+')
    fireEvent.click(create)

    expect(screen.getByText('Sheet 2')).toBeTruthy()
    expect(screen.getAllByText(/Sheet/).length).toBe(2)
    // check that all cells are empty
    // -> ...
  })
  it('should allow tab change', () => {
    expect(screen.getByText('Sheet 2').className).toContain(selectedClassName)
    expect(screen.getByText('Sheet 1').className).not.toContain(
      selectedClassName
    )
    // expect all cells to be empty
    // -> ...

    fireEvent.click(screen.getByText('Sheet 1'))
    expect(screen.getByText('Sheet 2').className).not.toContain(
      selectedClassName
    )
    expect(screen.getByText('Sheet 1').className).toContain(selectedClassName)
    // expect cells to be filled
    // -> ...
  })
  it('should allow tab deletion', () => {
    const removeButton = document.getElementsByClassName('remove-tab')[1]

    expect(screen.getByText('Sheet 2')).toBeTruthy()
    fireEvent.click(removeButton)
    expect(screen.queryByText('Sheet 2')).toBeFalsy()
  })
})
