// ? mock matrix
// ? mock table

import SpreadSheet from '@/components/Spreadsheet'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, expect, it } from 'vitest'

import { render, screen } from '@testing-library/react'
import { parentTag } from '@/components/Spreadsheet/data/constants'

describe('Spreadsheet component with context', () => {
  beforeAll(() => {
    render(
      <MatrixProvider rows={10} cols={10}>
        <SpreadSheet />
      </MatrixProvider>
    )
  })
  it('should render the component with specified parameters from matrix', () => {
    expect(screen.getAllByText(/[A-J]/).length).toBe(10)
    expect(screen.getAllByText(/[0-9]{1,2}/).length).toBe(10)
    expect(document.getElementsByTagName(parentTag).length).toBe(100)
    expect(screen.queryByText('K')).toBeFalsy()
    expect(screen.queryByText('0')).toBeFalsy()
    expect(screen.queryByText('11')).toBeFalsy()
  })
})

// Spreadsheet
// Specific values are shown based on cell values
// Input and input values are visible on click

// Matrix
// cyclic references
// reference array (add, remove, update)
// debounced update all
// text inputs
// computed inputs
// referenced inputs
// cells updates on input.blur() even without refArray

// Table selection
// click header selects column
// click row header selects row
// multiple clicks only select one row/column
// certain keys remove selection
// delete, deletes cells values if saved even on refresh

// Table clipboard
// copy column separated by \n row separated by \tab
// paste same as copy

// Table navigation
// Arrows
// Esc
// Enter
// Tab
