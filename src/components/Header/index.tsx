import { DownloadOptions } from '@/components/Header/components/DownloadOptions'
import {
  Download,
  Moon,
  Save,
  Sun,
  Upload,
} from '@/components/Header/components/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { Modal } from '@/components/Modal'
import { parseFilesToMatrix } from '@/components/Spreadsheet/utils/file'
import { useMatrix } from '@/context/matrix/useMatrix'
import { ChangeEvent, useState } from 'react'

export function Header() {
  const [openModal, setOpenModal] = useState(false)
  const { save, download, createNewMatrix } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) parseFilesToMatrix(files, createNewMatrix)
  }

  return (
    <header>
      <h1>Computed File</h1>
      <div className='header-icons flex-center'>
        <label className='btn-round flex-center button' htmlFor='upload'>
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
        <button
          className='btn-round flex-center'
          onClick={() => setOpenModal((prev) => !prev)}
        >
          <Download />
        </button>
        {openModal && (
          <Modal>
            <DownloadOptions
              onSubmit={download}
              onClose={() => setOpenModal((prev) => !prev)}
            />
          </Modal>
        )}
        <button className='btn-round flex-center' name='save' onClick={save}>
          <Save />
        </button>
        <button
          className='btn-round flex-center'
          name='toggle-dark-theme'
          onClick={toggleDarkTheme}
        >
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}
