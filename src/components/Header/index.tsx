import {
  Download,
  Moon,
  Save,
  Sun,
  Upload,
} from '@/components/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { useMatrix } from '@/context/matrix/useMatrix'

export default function Header() {
  const { save, download } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  return (
    <header>
      <h1>Computed File</h1>
      <div className='utils'>
        <label htmlFor='upload' className='upload-wrapper'>
          <input
            className='upload-input'
            multiple
            accept='.csv, application/vnd.ms-excel, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            type='file'
            id='upload'
            hidden
            aria-hidden
          />
          <button className='upload-btn' aria-label='upload'>
            <Upload />
          </button>
        </label>
        <button className='download-btn' onClick={download}>
          <Download />
        </button>
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
