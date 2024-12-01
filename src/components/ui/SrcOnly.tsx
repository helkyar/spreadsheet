export function SrOnly({ children }: { readonly children: React.ReactNode }) {
  return <span className='sr-only'>{children}</span>
}
