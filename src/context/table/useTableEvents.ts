import { TableContext } from '@/context/table/TableContext'
import { useContext } from 'react'

export const useTableEvents = () => {
  const table = useContext(TableContext)
  if (!table) {
    throw new Error('useTableEvents must be used within a TableProvider')
  }
  return table
}
