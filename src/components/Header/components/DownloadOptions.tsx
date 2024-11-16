import {
  ExportValue,
  File,
  Separation,
  type DownloadOptions,
} from '@/components/Spreadsheet/data/types'
import { FormEvent, useEffect } from 'react'
type PropTypes = {
  onSubmit: (options: Omit<DownloadOptions, 'id'>) => void
  onClose: () => void
}

export function DownloadOptions({ onClose, onSubmit }: PropTypes) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const { exportValue, fileType, separation } =
      form.elements as typeof form.elements & {
        exportValue: HTMLInputElement
        fileType: HTMLInputElement
        separation: HTMLInputElement
      }

    onSubmit({
      value: exportValue.value as ExportValue,
      file: fileType.value as File,
      separation: separation.value as Separation,
    })

    onClose()
  }

  useEffect(() => {
    const handleClose = (event: MouseEvent) => {
      if ((event.target as HTMLElement).className === 'modal-wrapper') onClose()
    }

    document.addEventListener('click', handleClose)
    return () => document.removeEventListener('click', handleClose)
  }, [onClose])

  return (
    <form onSubmit={handleSubmit} className='download-form'>
      <fieldset>
        <legend>Export values</legend>
        <label>
          <input
            type='radio'
            name='exportValue'
            value='expression'
            defaultChecked
          />
          Expression
        </label>
        <label>
          <input type='radio' name='exportValue' value='value' /> Value
        </label>
      </fieldset>
      <fieldset>
        <legend>File type</legend>
        <label>
          <input
            type='radio'
            name='fileType'
            value='plain/text'
            defaultChecked
          />
          Plain Text
        </label>
        <label>
          <input type='radio' name='fileType' value='csv' /> CSV
        </label>
      </fieldset>
      <fieldset>
        <legend>Separation</legend>
        <label>
          <input type='radio' name='separation' value='\t' defaultChecked />
          Tabs
        </label>
        <label>
          <input type='radio' name='separation' value=',' /> Comas
        </label>
      </fieldset>
      <button type='submit'>Download</button>
    </form>
  )
}
