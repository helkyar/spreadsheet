import { Toaster as Sonner } from 'sonner'
export { toast } from 'sonner'
type ToasterProps = React.ComponentProps<typeof Sonner>
export const Toaster = ({ ...props }: ToasterProps) => {
  //   const { theme = 'system' } = useTheme()

  return (
    <Sonner
      //   theme={theme as ToasterProps['theme']}
      theme="system"
      position="top-right"
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:text-primary-foreground group-[.toaster]:bg-primary',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}
