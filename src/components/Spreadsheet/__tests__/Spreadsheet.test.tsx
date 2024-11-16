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
