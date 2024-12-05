type PropTypes = {
  readonly children: React.ReactNode
}

export function Table({ children }: PropTypes) {
  return <table aria-label='spreadsheet'>{children}</table>
}
