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
import { DownloadOptions as DownloadOptionsType } from '@/context/table/data/types'
import { parseFilesToMatrix } from '@/context/table/utils/file'
import { useMatrix } from '@/context/matrix/useMatrix'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { keyGroups } from '@/context/table/data/constants'
import useMountTransition from '@/logic/useMountTransition'

export function Header() {
  const { save, download, createNewMatrix } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal((open) => !open)
  const isMounted = useMountTransition(openModal)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) parseFilesToMatrix(files, createNewMatrix)
  }

  const handleDownload = (formData: Omit<DownloadOptionsType, 'id'>) => {
    download(formData)
    toggleModal()
  }

  const handleKey = (event: KeyboardEvent) => {
    if (keyGroups.execute.includes(event.key)) {
      document.getElementById('upload')?.click()
    }
  }

  return (
    <header>
      <h1>Computed File</h1>

      <section className='header-icons flex-center'>
        <label
          tabIndex={0}
          aria-label='upload'
          className='btn-round flex-center button'
          htmlFor='upload'
          onKeyDown={handleKey}
        >
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

        <button
          className='btn-round flex-center'
          onClick={toggleModal}
          aria-label='download'
        >
          <Download />
          {(openModal || isMounted) && (
            <Modal
              className={`${isMounted && 'in'} ${openModal && 'visible'}`}
              onClose={toggleModal}
            >
              <DownloadOptions onSubmit={handleDownload} />
            </Modal>
          )}
        </button>

        <button
          className='btn-round flex-center'
          onClick={save}
          aria-label='save'
        >
          <Save />
        </button>

        <button
          className='btn-round flex-center'
          onClick={toggleDarkTheme}
          aria-label='toggle dark mode'
        >
          {isDark ? <Sun /> : <Moon />}
        </button>
      </section>
    </header>
  )
}
