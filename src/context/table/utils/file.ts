import { parentTag, supportedFileTypes } from '@/context/table/data/constants'
import { DownloadOptions, HTMLCell } from '@/context/table/data/types'
import { $$ } from '@/context/table/utils/cell'
import {
  formatCellValuesToText,
  formatTextToCellValues,
} from '@/context/table/utils/format'
import { toast } from '@/components/ui/toast'
import { Matrix } from '@/context/matrix/data/types'

export const parseFilesToMatrix = (
  files: FileList,
  createNewMatrix: (matrix: Matrix) => void
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
      const matrix = formatTextToCellValues(result as string)
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

  const matrix = Array.from($$(parentTag)) as HTMLCell[]
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
