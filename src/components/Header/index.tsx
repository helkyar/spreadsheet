import {
  Download,
  Moon,
  Save,
  Sun,
  Upload,
} from '@/components/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { parseFilesToMatrix } from '@/components/Spreadsheet/logic/cellUtils'
import { useMatrix } from '@/context/matrix/useMatrix'
import { ChangeEvent } from 'react'

export default function Header() {
  const { save, download, createNewMatrix } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) parseFilesToMatrix(files, createNewMatrix)
  }

  return (
    <header>
      <h1>Computed File</h1>
      <div className='utils'>
        <label className='upload-wrapper' htmlFor='upload'>
          <Upload />
          <input
            className='upload-input'
            multiple
            accept='.csv, application/vnd.ms-excel, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            type='file'
            id='upload'
            onChange={handleChange}
          />
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
