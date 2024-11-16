export type HTMLCell = HTMLTableCellElement
export type HTMLInput = HTMLInputElement
export type HTMLText = HTMLSpanElement
export type DownloadOptions = {
  id: string
  value: ExportValue
  file: File
  separation: string
}
export type File = 'csv' | 'plain/text'
export type ExportValue = 'value' | 'expression'
