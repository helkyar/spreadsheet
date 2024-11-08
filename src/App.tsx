import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SpreadSheet from '@/components/Spreadsheet'

function App() {
  return (
    <>
      <Header />
      <main>
        <SpreadSheet cols={10} rows={10} />
      </main>
      <Footer />
    </>
  )
}

export default App
