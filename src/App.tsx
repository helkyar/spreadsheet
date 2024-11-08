import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SpreadSheet from '@/components/Spreadsheet'
import { useSpreadSheet } from '@/components/Spreadsheet/logic/useSpreadSheet'

const cols = 10
const rows = 10

function App() {
  const { matrix, save } = useSpreadSheet({ cols, rows })

  return (
    <>
      <Header onSave={save} />
      <main>
        <SpreadSheet matrix={matrix} cols={cols} />
      </main>
      <Footer />
    </>
  )
}

export default App
