import { useLocalStorage } from '@/logic/useLocalStorage'
import SpreadSheet from '@/components/Spreadsheet/logic/SpreadSheet'
import { useEffect, useRef, useState } from 'react'
import { Cell } from '@/components/Spreadsheet/data/types'

type Params = {
  rows: number
  cols: number
}

const LOCAL_KEY = '_spreadsheet_'

export function useSpreadSheet({ rows, cols }: Params) {
  const [matrix, setMatrix] = useLocalStorage<Cell[][]>({ key: LOCAL_KEY })

  const initialValues = matrix ? { matrix } : { rows, cols }
  const spreadsheet = useRef(new SpreadSheet(initialValues))

  const [, setCount] = useState(0)
  const updater = () => setCount((c) => c + 1)

  useEffect(() => {
    return spreadsheet.current.setUpdateMethod(updater)
  }, [spreadsheet.current.matrix])

  const save = () => {
    setMatrix(spreadsheet.current.matrix)
  }

  return {
    matrix: spreadsheet.current.matrix,
    save,
    spreadsheet: spreadsheet.current,
  }
}
