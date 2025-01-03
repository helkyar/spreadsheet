import {
  cellTag,
  supportedFileTypes,
} from '@/components/Spreadsheet/data/constants'
import { DownloadOptions, HTMLCell } from '@/components/Spreadsheet/data/types'
import { $$ } from '@/components/Spreadsheet/utils/cell'
import {
  formatCellValuesToText,
  formatTextToCellValues,
} from '@/components/Spreadsheet/utils/format'
import { toast } from '@/components/ui/toast'
import { Matrix } from '@/context/matrix/data/types'

export const parseFilesToMatrix = (
  files: FileList,
  createNewMatrix: (matrix: Matrix) => void,
  separation?: string
) => {
  if (!files || files.length === 0) return

  Array.from(files).forEach((file) => {
    if (!supportedFileTypes.includes(file.type)) {
      toast.error('Unsupported file type')
      return
    }

    const reader = new FileReader()
    reader.onload = (eventReader) => {
      const { result } = eventReader.target as FileReader
      const matrix = formatTextToCellValues(result as string, separation)
      createNewMatrix(matrix)
    }

    reader.readAsText(file as Blob)
  })
}

export const downloadTable = ({
  id,
  value = 'expression',
  file = 'plain/text',
  separation,
}: DownloadOptions) => {
  const aElement = document.createElement('a')
  const fileType = file === 'csv' ? '.csv' : '.txt'
  aElement.setAttribute('download', id + fileType)

  const matrix = Array.from($$(cellTag)) as HTMLCell[]
  const isPlainText = value === 'expression'
  const text = formatCellValuesToText({
    elements: matrix,
    separation,
    isPlainText,
  })
  const blob = new Blob([text], { type: file })

  const href = URL.createObjectURL(blob)
  aElement.href = href
  aElement.setAttribute('href', href)
  aElement.setAttribute('target', '_blank')
  aElement.click()
  URL.revokeObjectURL(href)
}
