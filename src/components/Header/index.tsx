import { Moon, Save, Sun } from '@/components/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { useMatrix } from '@/context/matrix/MatrixProvider'

export default function Header() {
  const { save } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  return (
    <header>
      <h1>Header - edit options</h1>
      {/*TO_DO: Will be a section in the future */}
      <div className='utils'>
        <button className='save' onClick={save}>
          <Save />
        </button>
        <button className='dark-btn' onClick={toggleDarkTheme}>
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}
