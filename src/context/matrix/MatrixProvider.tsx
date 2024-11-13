import { Cell } from '@/context/matrix/data/types'
import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { MatrixContext } from '@/context/matrix/MatrixContext'
import { useLocalStorage } from '@/logic/useLocalStorage'
import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'

type Params = {
  rows: number
  cols: number
  children: ReactNode
}

const LOCAL_KEY = '_spreadsheet_'

export const MatrixProvider = ({ children, rows, cols }: Params) => {
  // Provide matrix, save method, change matrix for tabs
  const [matrix, setMatrix] = useLocalStorage<Cell[][]>({ key: LOCAL_KEY })

  const initialValues = matrix ? { matrix } : { rows, cols }
  const spreadsheet = useRef(new ComputedMatrix(initialValues))

  const [, setCount] = useState(0)
  const updater = () => setCount((c) => c + 1)

  useEffect(() => {
    return spreadsheet.current.setUpdateMethod(updater)
  }, [spreadsheet.current.matrix])

  const save = () => {
    setMatrix(spreadsheet.current.matrix)
  }

  const addColumn = (y: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    console.log(
      '🚀 ~ removeColumn ~ spreadsheet:',
      spreadsheet.current['refList']
    )
    spreadsheet.current.addColumn(y)
  }
  const addRow = (x: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    spreadsheet.current.addRow(x)
  }
  const removeColumn = (y: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    spreadsheet.current.removeColumn(y)
  }
  const removeRow = (x: number) => (event?: MouseEvent) => {
    event?.stopPropagation()
    spreadsheet.current.removeRow(x)
  }

  const value = {
    matrix: spreadsheet.current.matrix,
    addColumn,
    addRow,
    removeColumn,
    removeRow,
    save,
  }

  return (
    <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
  )
}
