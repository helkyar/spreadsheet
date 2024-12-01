import {
  Download,
  InfoIcon,
  Moon,
  Save,
  Sun,
  Upload,
} from '@/components/Header/components/ui/Icons'
import { useToggleDarkTheme } from '@/components/Header/logic/useToggleDarkTheme'
import { useMatrix } from '@/context/matrix/useMatrix'
import { useRef, useState } from 'react'
import { useMountTransition } from '@/logic/useMountTransition'
import { LegendModal } from '@/components/Header/components/Legend'
import { DownloadModal } from '@/components/Header/components/DownloadOptions'
import { UploadModal } from '@/components/Header/components/UploadOptions'
import { SrOnly } from '@/components/ui/SrcOnly'

const enum ModalType {
  Download = 'download',
  Legend = 'legend',
  Upload = 'upload',
}

const ModalOptions = {
  download: DownloadModal,
  legend: LegendModal,
  upload: UploadModal,
}

export function Header() {
  const { save } = useMatrix()
  const { toggleDarkTheme, isDark } = useToggleDarkTheme()

  const [openModal, setOpenModal] = useState(false)
  const currentModal = useRef<ModalType>(ModalType.Download)
  const toggleModal = (key: ModalType) => () => {
    currentModal.current = key
    setOpenModal(true)
  }

  const isMounted = useMountTransition(openModal)

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

        <button
          className='btn-round flex-center'
          onClick={toggleModal(ModalType.Upload)}
          aria-label='download'
        >
          <Upload />
          <SrOnly>Upload files</SrOnly>
        </button>

        <button
          className='btn-round flex-center'
          onClick={toggleModal(ModalType.Download)}
          aria-label='download'
        >
          <Download />
          <SrOnly>Download files</SrOnly>
        </button>

        <button
          className='btn-round flex-center'
          onClick={save}
          aria-label='save'
        >
          <Save />
          <SrOnly>Save all sheets</SrOnly>
        </button>

        <button
          className='btn-round flex-center'
          onClick={toggleDarkTheme}
          aria-label='toggle dark mode'
        >
          {isDark ? <Sun /> : <Moon />}
          <SrOnly>Toggle dark theme</SrOnly>
        </button>
      </section>
    </header>
  )
}
