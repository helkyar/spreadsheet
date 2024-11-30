import { DownloadOptions } from '@/components/Header/components/DownloadOptions'
import {
  Download,
  InfoIcon,
  Moon,
  Save,
  Sun,
  Upload,
} from '@/components/Header/components/ui/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { Modal } from '@/components/Modal'
import { DownloadOptions as DownloadOptionsType } from '@/components/Spreadsheet/data/types'
import { useMatrix } from '@/context/matrix/useMatrix'
import { ChangeEvent, useRef, useState } from 'react'
import { useMountTransition } from '@/logic/useMountTransition'
import { Legend } from '@/components/Header/components/Legend'
import { parseFilesToMatrix } from '@/components/Spreadsheet/utils/file'

type ModalProps = {
  readonly onClose: () => void
  readonly className: string | boolean
}

const enum ModalType {
  Download = 'download',
  Legend = 'legend',
}

const ModalOptions = {
  download: DownloadModal,
  legend: LegendModal,
}

export function Header() {
  const { save, createNewMatrix } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  const [openModal, setOpenModal] = useState(false)
  const currentModal = useRef<ModalType>(ModalType.Download)
  const toggleModal = (key: ModalType) => () => {
    currentModal.current = key
    setOpenModal(true)
  }

  const isMounted = useMountTransition(openModal)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) parseFilesToMatrix(files, createNewMatrix)
  }

  const ModalComponent = ModalOptions[currentModal.current]

  return (
    <header>
      <h1>Computed File</h1>

      <section className='header-icons flex-center'>
        {(isMounted || openModal) && (
          <ModalComponent
            onClose={() => setOpenModal(false)}
            className={`${isMounted && 'in'} ${openModal && 'visible'}`}
          />
        )}
        <button
          className='btn-round flex-center info'
          onClick={toggleModal(ModalType.Legend)}
          aria-label='information'
        >
          <InfoIcon />
        </button>

        <label className='btn-round flex-center button' htmlFor='upload'>
          <Upload />
          <input
            onChange={handleChange}
            className='upload-input'
            multiple
            accept='.csv, application/vnd.ms-excel, text/plain, .xlsx'
            type='file'
            aria-label='upload'
            id='upload'
          />
        </label>

        <button
          className='btn-round flex-center'
          onClick={toggleModal(ModalType.Download)}
          aria-label='download'
        >
          <Download />
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

function DownloadModal(props: ModalProps) {
  const { download } = useMatrix()
  const handleDownload = (formData: Omit<DownloadOptionsType, 'id'>) => {
    download(formData)
    props.onClose()
  }
  return (
    <Modal {...props}>
      <DownloadOptions onSubmit={handleDownload} />
    </Modal>
  )
}

function LegendModal(props: ModalProps) {
  return (
    <Modal {...props}>
      <Legend />
    </Modal>
  )
}
