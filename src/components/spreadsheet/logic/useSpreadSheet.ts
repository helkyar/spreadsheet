import SpreadSheet from '@/components/spreadsheet/logic/SpreadSheet'
import { useEffect, useRef, useState } from 'react'

type Params = {
  rows: number
  cols: number
}

export function useSpreadSheet(matrix: Params) {
  const spreadsheet = useRef(new SpreadSheet(matrix))

  const [, setCount] = useState(0)
  const updater = () => setCount((c) => c + 1)

  useEffect(() => {
    return spreadsheet.current.setUpdateMethod(updater)
  }, [spreadsheet.current.matrix])

  return { matrix: spreadsheet.current.matrix }
}
