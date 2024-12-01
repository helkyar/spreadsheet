import { Modal } from '@/components/Modal'
import {
  ExportValue,
  File,
  Separation,
  type DownloadOptions,
} from '@/components/Spreadsheet/data/types'
import { DownloadOptions as DownloadOptionsType } from '@/components/Spreadsheet/data/types'
import { useMatrix } from '@/context/matrix/useMatrix'
import { FormEvent } from 'react'

type ModalProps = {
  readonly onClose: () => void
  readonly className: string | boolean
}

export function DownloadModal(props: ModalProps) {
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

type PropTypes = {
  readonly onSubmit: (options: Omit<DownloadOptions, 'id'>) => void
}
function DownloadOptions({ onSubmit }: PropTypes) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const { exportValue, fileType, separation } = form.elements as unknown as {
      exportValue: HTMLInputElement
      fileType: HTMLInputElement
      separation: HTMLInputElement
    }

    onSubmit({
      value: exportValue.value as ExportValue,
      file: fileType.value as File,
      separation: separation.value as Separation,
    })
  }

  return (
    <section className='download-form-wrapper'>
      <h2>Download Current Sheet</h2>
      <form onSubmit={handleSubmit} className='download-form'>
        <fieldset>
          <legend>Export values</legend>
          <label className='button'>
            <input
              type='radio'
              name='exportValue'
              value='expression'
              defaultChecked
            />
            <span>Expression</span>
          </label>
          <label className='button'>
            <input type='radio' name='exportValue' value='value' /> Value
          </label>
        </fieldset>
        <fieldset>
          <legend>File type</legend>
          <label className='button'>
            <input
              type='radio'
              name='fileType'
              value='plain/text'
              defaultChecked
            />
            <span>Plain Text</span>
          </label>
          <label className='button'>
            <input type='radio' name='fileType' value='csv' /> CSV
          </label>
        </fieldset>
        <fieldset>
          <legend>Separation</legend>
          <label className='button'>
            <input type='radio' name='separation' value={'\t'} defaultChecked />
            <span>Tabs</span>
          </label>
          <label className='button'>
            <input type='radio' name='separation' value=',' /> Comas
          </label>
        </fieldset>
        <button className='action-button' type='submit'>
          Download
        </button>
      </form>
    </section>
  )
}
