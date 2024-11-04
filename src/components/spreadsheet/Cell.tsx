export default function Cell({
  children,
  x,
  y,
}: {
  children: React.ReactNode
  x: number
  y: number
}) {
  console.log('🚀 ~ y:', y)
  console.log('🚀 ~ x:', x)

  return <td>{children}</td>
}
