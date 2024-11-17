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
import { DownloadOptions as DownloadOptionsType } from '@/components/Spreadsheet/data/types'
import { parseFilesToMatrix } from '@/components/Spreadsheet/utils/file'
import { useMatrix } from '@/context/matrix/useMatrix'
import { ChangeEvent, useState } from 'react'

export function Header() {
  const { save, download, createNewMatrix } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal((prev) => !prev)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) parseFilesToMatrix(files, createNewMatrix)
  }

  const handleDownload = (formData: Omit<DownloadOptionsType, 'id'>) => {
    download(formData)
    toggleModal()
  }

  return (
    <header>
      <h1>Computed File</h1>
      <section className='header-icons flex-center'>
        <label className='btn-round flex-center button' htmlFor='upload'>
          <Upload />
          <input
            className='upload-input'
            multiple
            accept='.csv, application/vnd.ms-excel, text/plain, .xlsx'
            type='file'
            id='upload'
            onChange={handleChange}
          />
        </label>
        <button className='btn-round flex-center' onClick={toggleModal}>
          <Download />
          <Modal isOpen={openModal} onClose={toggleModal}>
            <DownloadOptions onSubmit={handleDownload} />
          </Modal>
        </button>

        <button className='btn-round flex-center' onClick={save}>
          <Save />
        </button>
        <button className='btn-round flex-center' onClick={toggleDarkTheme}>
          {isDark ? <Sun /> : <Moon />}
        </button>
      </section>
    </header>
  )
}
