import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>({
  key,
  defaultValue,
}: {
  key: string
  defaultValue?: T
}): [T, (value: ((value: T) => T) | T) => void, () => void] {
  const [value, setValue] = useState<unknown>(() => {
    const localValue = window.localStorage.getItem(key)
    const parsedValue = localValue ? JSON.parse(localValue) : defaultValue
    return parsedValue
  })

  useEffect(() => {
    if (value == null) return
    const stringifiedValue = JSON.stringify(value)
    window.localStorage.setItem(key, stringifiedValue)
  }, [value, key])

  const remove = useCallback(() => {
    window.localStorage.removeItem(key)
    setValue(undefined)
  }, [key])

  return [value as T, setValue, remove] as const
}
