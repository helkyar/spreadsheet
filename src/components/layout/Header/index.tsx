import { Moon, Save, Sun } from '@/components/layout/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/layout/Header/logic/useToggleDarkTheme'

export default function Header() {
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()
  return (
    <header>
      <h1>Header - edit options</h1>
      {/*TO_DO: Will be a section in the future */}
      <div className='utils'>
        <button className='save'>
          <Save />
        </button>
        <button className='dark-btn' onClick={toggleDarkTheme}>
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}
