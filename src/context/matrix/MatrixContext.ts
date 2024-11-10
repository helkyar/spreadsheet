import { MatrixContext as MatrixContextType } from '@/context/matrix/data/types'
import { createContext } from 'react'

export const MatrixContext = createContext(null as unknown as MatrixContextType)
