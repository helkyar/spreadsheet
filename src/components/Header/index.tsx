import { Moon, Save, Sun } from '@/components/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { useMatrix } from '@/context/matrix/MatrixProvider'

export default function Header() {
  const { save } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  return (
    <header>
      <h1>Header - edit options</h1>
      <div className='utils'>
        <button className='save-btn' name='save' onClick={save}>
          <Save />
        </button>
        <button
          className='dark-btn'
          name='toggle-dark-theme'
          onClick={toggleDarkTheme}
        >
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}
