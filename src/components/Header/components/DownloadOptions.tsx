import {
  ExportValue,
  File,
  Separation,
  type DownloadOptions,
} from '@/components/Spreadsheet/data/types'
import { FormEvent } from 'react'

type PropTypes = {
  readonly onSubmit: (options: Omit<DownloadOptions, 'id'>) => void
}

export function DownloadOptions({ onSubmit }: PropTypes) {
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
          <span>Expression</span>
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
          <span>Plain Text</span>
        </label>
        <label>
          {/* FIX_ME: block separation selection if csv */}
          <input type='radio' name='fileType' value='csv' /> CSV
        </label>
      </fieldset>
      <fieldset>
        <legend>Separation</legend>
        <label>
          <input type='radio' name='separation' value='\t' defaultChecked />
          <span>Tabs</span>
        </label>
        <label>
          <input type='radio' name='separation' value=',' /> Comas
        </label>
      </fieldset>
      <button className='action-button' type='submit'>
        Download
      </button>
    </form>
  )
}
