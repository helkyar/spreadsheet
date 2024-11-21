import { Header } from '@/components/Header'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, expect, it } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'
import { THEME_KEY } from '@/components/Header/logic/useToggleDarkTheme'

describe('Header component with context', () => {
  beforeAll(() => {
    render(
      <MatrixProvider rows={10} cols={10}>
        <Header />
      </MatrixProvider>
    )
  })
  it('should save the matrix on re-render', () => {
    const saveBtn = screen.getAllByRole('button')[1]

    // TO_DO:
    //  expect matrix with no value
    //  modify value
    fireEvent.click(saveBtn)
    //  refresh
    //  expect new value to be maintained
  })

  it('should change the theme and maintain it on re-render', () => {
    const darkModeBtn = screen.getAllByRole('button')[2]

    const storedTheme = () => window.localStorage.getItem(THEME_KEY)
    const darkThemeEnabled = document.getElementsByClassName('dark')

    expect(darkThemeEnabled.length).toBe(0)
    expect(storedTheme()).toBe('false')

    fireEvent.click(darkModeBtn)

    expect(darkThemeEnabled.length).toBe(1)
    expect(storedTheme()).toBe('true')
  })
})
