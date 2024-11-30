import ErrorBoundary from '@/components/ErrorBoundary'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SpreadSheet } from '@/components/Spreadsheet'

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main>
        <SpreadSheet />
      </main>
      <Footer />
    </>
  )
}

export default App
