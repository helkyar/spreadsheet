import { KeyboardEvent, MouseEvent } from 'react'

type TableContext = {
  selectColumn: (index: number) => (event: MouseEvent | KeyboardEvent) => void
  selectRow: (index: number) => (event: MouseEvent | KeyboardEvent) => void
  selectedElements: Selected
}
export type HTMLCell = HTMLTableCellElement
export type HTMLInput = HTMLInputElement
export type HTMLText = HTMLSpanElement
export type HTMLHeader = HTMLTableElement
export type DownloadOptions = {
  id: string
  value: ExportValue
  file: File
  separation: Separation
}
export type File = 'csv' | 'plain/text'
export type ExportValue = 'value' | 'expression'
export type Separation = '\t' | ','
export type Selected = HTMLCell[] | null
