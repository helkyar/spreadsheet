import { Matrix } from '@/context/matrix/data/types'
import { MatrixContext } from '@/context/matrix/MatrixContext'
import { useLocalStorage } from '@/logic/useLocalStorage'
import { MouseEvent, ReactNode, useCallback, useState } from 'react'
import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { v4 as uuidv4 } from 'uuid'
import { toast } from '@/components/ui/toast'
import { downloadTable } from '@/context/table/utils/file'
import { DownloadOptions } from '@/context/table/data/types'

type Params = {
  rows: number
  cols: number
  children: ReactNode
}

const LOCAL_KEY = '_spreadsheet_'

export const MatrixProvider = ({ children, rows, cols }: Params) => {
  const [matrices, setMatrices] = useLocalStorage<Matrix[]>({ key: LOCAL_KEY })

  const [, setBoolean] = useState(false)
  const updater = () => setBoolean((b) => !b)

  const [matrixArray, setMatrixArray] = useState<
    { id: string; spreadsheet: ComputedMatrix }[]
  >(() => {
    if (!matrices || matrices.length === 0) {
      const spreadsheet = new ComputedMatrix({ rows, cols })
      spreadsheet.setUpdateMethod(updater)
      return [{ id: uuidv4(), spreadsheet }]
    }
    return matrices.map((matrix) => {
      const spreadsheet = new ComputedMatrix({ matrix })
      spreadsheet.setUpdateMethod(updater)
      return { id: uuidv4(), spreadsheet }
    })
  })
  const [matrixIdx, setMatrixIdx] = useState(0)

  const createNewMatrix = useCallback(
    (matrix?: Matrix) => {
      const initialValue = matrix ? { matrix } : { rows, cols }
      const spreadsheet = new ComputedMatrix(initialValue)
      spreadsheet.setUpdateMethod(updater)
      setMatrixArray((prev) => [...prev, { id: uuidv4(), spreadsheet }])

      setMatrixIdx(matrixArray.length)
    },
    [cols, rows, matrixArray]
  )

  const viewMatrix = (index: number) => {
    setMatrixIdx(index)
  }

  const save = () => {
    const matrices = matrixArray.map(({ spreadsheet }) => spreadsheet.matrix)
    setMatrices(matrices)
  }

  const download = (options: Omit<DownloadOptions, 'id'>) => {
    const { id } = matrixArray[matrixIdx]
    downloadTable({ id, ...options })
  }

  const removeMatrix = (index: number) => {
    if (matrixArray.length === 1) {
      toast.error('Create another sheet to delete this one')
      return
    }

    setMatrixArray((prev) => {
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })

    if (index < matrixIdx) setMatrixIdx((prev) => prev - 1)
    if (index === matrixIdx) setMatrixIdx(0)
  }

  const addColumn = (y: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    matrixArray[matrixIdx].spreadsheet.addColumn(y)
  }
  const addRow = (x: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    matrixArray[matrixIdx].spreadsheet.addRow(x)
  }
  const removeColumn = (y: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    matrixArray[matrixIdx].spreadsheet.removeColumn(y)
  }
  const removeRow = (x: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    matrixArray[matrixIdx].spreadsheet.removeRow(x)
  }

  const { id, spreadsheet } = matrixArray[matrixIdx]
  const value = {
    currentMatrix: { id, matrix: spreadsheet.matrix },
    matrixArray,
    matrixIdx,
    viewMatrix,
    createNewMatrix,
    removeMatrix,
    addColumn,
    addRow,
    removeColumn,
    removeRow,
    save,
    download, // if provider grows move this to a separate context/hook
  }

  return (
    <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
  )
}
