import SpreadSheet from '@/components/Spreadsheet/logic/SpreadSheet'
import { MouseEvent, useCallback, useEffect, useState } from 'react'

const selected = 'selected'
export function useTable(spreadsheet: SpreadSheet) {
  const $$ = (el: string) => document.querySelectorAll(el)
  const getSelectedElements = useCallback(
    () => $$(`.${selected}`) as NodeListOf<HTMLElement>,
    []
  )

  const [selectedElements, setSelectedElements] = useState<
    NodeListOf<HTMLElement>
  >([] as unknown as NodeListOf<HTMLElement>)

  const removeSelectedFromElements = useCallback(() => {
    selectedElements.forEach((el) => el.classList.remove(selected))
    setSelectedElements([] as unknown as NodeListOf<HTMLElement>)
  }, [selectedElements])

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      console.log('🚀 ~ keyDown ~ event:', event.key)
      const doNothing = ['Control']
      const removeSelected = ['Tab', 'Escape']
      const deleteValues = ['Backspace', 'Delete']

      if (removeSelected.includes(event.key)) {
        removeSelectedFromElements()
      }
      //
      else if (doNothing.includes(event.key)) return
      //
      else if (deleteValues.includes(event.key)) {
        if (selectedElements.length == 0) return

        const input = selectedElements[1].children[1] as HTMLInputElement
        if (document.activeElement === input) return

        const cells: number[][] = []
        selectedElements.forEach((el) => {
          if (el.tagName !== 'TD') return

          const { x = -1, y = -1 } = el.dataset
          cells.push([Number(x), Number(y)])

          //updates uncontrolled input
          const input = el.children[1] as HTMLInputElement
          input.value = ''
        })
        spreadsheet.updateCellsValue(cells, 'remove')
      }
      //
      else if (event.key === 'Enter') {
        if (selectedElements.length == 0) return

        const input = selectedElements[1].children[1] as HTMLInputElement
        input.blur()
        const value = input.value.trim()
        const cells: number[][] = []
        selectedElements.forEach((el) => {
          if (el.tagName !== 'TD') return

          const { x = -1, y = -1 } = el.dataset
          cells.push([Number(x), Number(y)])

          //updates uncontrolled input
          const input = el.children[1] as HTMLInputElement
          if (input) input.value = value
        })
        spreadsheet.updateCellsValue(cells, 'add', value)
      }
      //
      else {
        if (selectedElements.length == 0) return

        const input = selectedElements[1].children[1] as HTMLInputElement
        input.focus()
      }
    }

    document.addEventListener('keydown', keyDown)
    return () => document.removeEventListener('keydown', keyDown)
  }, [selectedElements, spreadsheet, removeSelectedFromElements])

  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      if (selectedElements.length > 0) {
        const selectedValues = Array.from(selectedElements).map((el) => {
          if (el.tagName !== 'TD') return

          const span = el.children[0] as HTMLSpanElement
          const value = span.innerText
          return value
        })

        event.clipboardData?.setData('text/plain', selectedValues.join('\n'))
        event.preventDefault()
      }
    }

    document.addEventListener('copy', copy)
    return () => document.removeEventListener('copy', copy)
  }, [selectedElements])

  const addSelectedClassToElements = (
    elements: HTMLElement[] | NodeListOf<Element>
  ) => {
    elements.forEach((el) => el.classList.add(selected))
  }

  const oneCellSelection = (element: HTMLElement) => {
    removeSelectedFromElements()
    if (element) addSelectedClassToElements([element])
  }

  const handleSelectColumn =
    (index: number) => (event: MouseEvent<HTMLElement>) => {
      if (index === 0) return
      event.stopPropagation()
      oneCellSelection(event.currentTarget)

      const columCells = $$(`tr td:nth-child(${index + 1})`)
      addSelectedClassToElements(columCells)

      setSelectedElements(getSelectedElements())
    }

  const handleSelectRow =
    (index: number) => (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      oneCellSelection(event.currentTarget)

      const rowCells = $$(`tr:nth-child(${index + 1}) td`)
      addSelectedClassToElements(rowCells)

      setSelectedElements(getSelectedElements())
    }

  return {
    handleSelectRow,
    handleSelectColumn,
    removeSelectedFromElements,
  }
}
