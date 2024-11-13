import { MatrixContext } from '@/context/matrix/MatrixContext'
import { useContext } from 'react'

export const useMatrix = () => {
  const matrix = useContext(MatrixContext)
  if (!matrix) {
    throw new Error('useMatrix must be used within a MatrixProvider')
  }
  return matrix
}
