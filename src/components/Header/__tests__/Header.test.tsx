import Header from '@/components/Header'
// import Spreadsheet from '@/components/Spreadsheet'
import { MatrixProvider } from '@/context/matrix/MatrixProvider'
import { beforeAll, describe, expect, it } from 'vitest'

import { fireEvent, render } from '@testing-library/react'
import { THEME_KEY } from '@/components/Header/logic/useToggleDarkTheme'

describe('Header component with context', () => {
  let container: HTMLElement
  beforeAll(() => {
    const result = render(
      <MatrixProvider rows={10} cols={10}>
        <Header />
        {/* <Spreadsheet/> */}
      </MatrixProvider>
    )
    container = result.container
  })
  it('should save the matrix on re-render', () => {
    const saveBtn = container.getElementsByClassName(
      'save-btn'
    )[0] as HTMLButtonElement

    // TO_DO:
    //  expect matrix with no value
    //  modify value
    fireEvent.click(saveBtn)
    //  refresh
    //  expect new value to be maintained
  })

  it('should change the theme and maintain it on re-render', () => {
    const darkModeBtn = container.getElementsByClassName(
      'dark-btn'
    )[0] as HTMLButtonElement
    const storedTheme = () => window.localStorage.getItem(THEME_KEY)
    const darkThemeEnabled = document.getElementsByClassName('dark')

    expect(darkThemeEnabled.length).toBe(0)
    expect(storedTheme()).toBe('false')

    fireEvent.click(darkModeBtn)

    expect(darkThemeEnabled.length).toBe(1)
    expect(storedTheme()).toBe('true')
  })
})
