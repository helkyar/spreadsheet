import { useEffect } from 'react'

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  onClickOutside: (event?: MouseEvent) => void
) {
  useEffect(() => {
    const eventHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target === (ref.current as Node)) return
      onClickOutside()
    }

    document.addEventListener('mousedown', eventHandler)
    return () => {
      document.removeEventListener('mousedown', eventHandler)
    }
  }, [ref, onClickOutside])
}
