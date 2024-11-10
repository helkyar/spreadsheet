import { Cell } from '@/context/matrix/data/types'
import MatrixClient from '@/context/matrix/MatrixClient'
import { MatrixContext } from '@/context/matrix/MatrixContext'
import { useLocalStorage } from '@/logic/useLocalStorage'
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'

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
  const spreadsheet = useRef(new MatrixClient(initialValues))

  const [, setCount] = useState(0)
  const updater = () => setCount((c) => c + 1)

  useEffect(() => {
    return spreadsheet.current.setUpdateMethod(updater)
  }, [spreadsheet.current.matrix])

  const save = () => {
    setMatrix(spreadsheet.current.matrix)
  }

  const value = {
    matrix: spreadsheet.current.matrix,
    save,
  }

  return (
    <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
  )
}

export const useMatrix = () => useContext(MatrixContext)
