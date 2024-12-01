import { Modal } from '@/components/Modal'
import { parseFilesToMatrix } from '@/components/Spreadsheet/utils/file'
import { useMatrix } from '@/context/matrix/useMatrix'
import { useState } from 'react'

type ModalProps = {
  readonly onClose: () => void
  readonly className: string | boolean
}

export function UploadModal(props: ModalProps) {
  return (
    <Modal {...props}>
      <UploadOptions onClose={props.onClose} />
    </Modal>
  )
}

function UploadOptions({ onClose }: { readonly onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false)
  const [separation, setSeparation] = useState('\t')
  const { createNewMatrix } = useMatrix()

  const createMatrixFromFiles = (files: FileList) => {
    parseFilesToMatrix(files, createNewMatrix, separation)
    onClose()
  }
  const handleDropFromDesktop = (event: React.DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer?.types.includes('Files')) {
      createMatrixFromFiles(event.dataTransfer.files)
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) createMatrixFromFiles(event.target.files)
  }

  return (
    <section className='upload-modal'>
      <h2>Upload Options</h2>
      {/* Drop files */}
      <div
        onDrop={handleDropFromDesktop}
        onDragOver={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        className={`drop-files-area flex-center ${dragOver && 'drag-over'}`}
        role='none'
      >
        <h3>Drop your files here</h3>
      </div>
      <form>
        <fieldset>
          <div>
            <legend>Separation:</legend>
            <label className='button'>
              <input
                type='radio'
                onChange={(e) => setSeparation(e.target.value)}
                name='separation'
                value='\t'
                defaultChecked
              />
              <span>Tabs</span>
            </label>
            <label className='button'>
              <input
                onChange={(e) => setSeparation(e.target.value)}
                type='radio'
                name='separation'
                value=','
              />
              <span>Comas</span>
            </label>
          </div>
        </fieldset>
        <label
          className='upload-label flex-center action-button'
          htmlFor='upload'
        >
          <span>Choose from computer</span>
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
      </form>
    </section>
  )
}
