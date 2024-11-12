import SpreadSheet from '@/components/Spreadsheet'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, it } from 'vitest'

import { render } from '@testing-library/react'

describe('useTableEvents hook tested through ui', () => {
  beforeAll(() => {
    render(
      <MatrixProvider rows={10} cols={10}>
        <SpreadSheet />
      </MatrixProvider>
    )
  })
  it('should select column on column header click', () => {
    // multiple clicks only select one row/column
  })
  it('should select row on row header click', () => {
    // multiple clicks only select one row/column
  })
  it('should update all selected cells values on write and Enter', () => {})
  it('should select input on Enter and the cell below if pressed again', () => {})
  it('should delete all cells values on delete', () => {})
  it('should select other cell on arrow key press if cell is focused', () => {})
  it('should copy selected cells values to clipboard', () => {
    // TO_DO: implement clipboard copy pattern feature
    // columns separated by /n, rows separated by /t
  })
  it('should paste clipboard values to selected cells', () => {
    // TO_DO: implement feature
  })
})

// certain keys remove selection
// Esc, Tab
