import { Moon, Save, Sun } from '@/components/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'

export default function Header({ onSave }: { onSave: () => void }) {
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()
  return (
    <header>
      <h1>Header - edit options</h1>
      {/*TO_DO: Will be a section in the future */}
      <div className='utils'>
        <button className='save' onClick={onSave}>
          <Save />
        </button>
        <button className='dark-btn' onClick={toggleDarkTheme}>
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}
