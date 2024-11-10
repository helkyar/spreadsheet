import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MatrixProvider } from '@/context/matrix/MatrixProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MatrixProvider rows={10} cols={10}>
      <App />
    </MatrixProvider>
  </StrictMode>
)
