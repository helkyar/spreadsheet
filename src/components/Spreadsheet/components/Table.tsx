type PropTypes = {
  children: React.ReactNode
}

export function Table({ children }: PropTypes) {
  return (
    <section className='table-wrapper'>
      <table>{children}</table>
    </section>
  )
}
