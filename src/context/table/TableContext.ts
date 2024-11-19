import { TableContext as TableContextType } from '@/context/table/data/types'
import { createContext } from 'react'

export const TableContext = createContext(null as unknown as TableContextType)
