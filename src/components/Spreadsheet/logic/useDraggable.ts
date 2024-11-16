import { useCallback, useEffect } from 'react'
import {
  getCell,
  getCurrentCellCoordinates,
  getInput,
  parseFilesToMatrix,
} from '@/components/Spreadsheet/logic/cellUtils'
import { HTMLCell, HTMLInput } from '@/components/Spreadsheet/data/types'
import { useMatrix } from '@/context/matrix/useMatrix'
import { inputTag } from '@/components/Spreadsheet/data/constants'

export function useDraggable(
  selectedElements: NodeListOf<HTMLCell>,
  removeSelection: () => void
) {
  const { createNewMatrix } = useMatrix()

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
  }, [])

  function handleDragLeave(event: MouseEvent) {
    event.preventDefault()
  }

  const handleDropFromDesktop = useCallback(
    (event: DragEvent) => {
      const { dataTransfer } = event

      if (dataTransfer?.types.includes('Files')) {
        const { files } = dataTransfer
        parseFilesToMatrix(files, createNewMatrix)
      }
    },
    [createNewMatrix]
  )

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      handleDropFromDesktop(event)

      if (!selectedElements) return

      const input = event.target as HTMLInput
      if (input.tagName !== inputTag) return
      const finalCell = input.parentNode as HTMLCell

      const { x, y } = getCurrentCellCoordinates(finalCell)

      selectedElements.forEach((el, _, self) => {
        const { x: iX, y: iY } = getCurrentCellCoordinates(self[0])
        const { x: elX, y: elY } = getCurrentCellCoordinates(el)

        if (elX === x && elY === y) return

        const cell = getCell({
          x: elX + x - elX + (elX - iX),
          y: elY + y - elY + (elY - iY),
        })

        const initialCellInput = getInput(el)
        const value = initialCellInput.value
        initialCellInput.value = ''
        initialCellInput.focus()
        initialCellInput.blur()

        const finalCellInput = getInput(cell)
        finalCellInput.value = value
        finalCellInput.focus()
        finalCellInput.blur()
      })
      finalCell.focus()
    },
    [selectedElements, handleDropFromDesktop]
  )

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      const ghost = document.getElementById('ghost')

      Array.from(selectedElements).forEach((el, i) => {
        const clone = el.cloneNode(true) as HTMLCell
        clone.style.cssText = `
          background: var(--selected);
          position: absolute;
          top: ${i * 3}px;
          left: ${i * 3}px;
          z-index: ${999999 - i * 5};
          width: ${el.offsetWidth}px;
          height: ${el.offsetHeight}px;
        `
        ghost?.appendChild(clone)
      })

      if (!event.dataTransfer) return
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setDragImage(ghost || selectedElements[0], -10, -10)
    },
    [selectedElements]
  )

  const handleDragEnd = useCallback(() => {
    if (!selectedElements) return
    const ghost = document.getElementById('ghost')
    selectedElements.forEach(() => {
      ghost?.removeChild(ghost.firstChild as Node)
    })

    removeSelection()
  }, [selectedElements, removeSelection])

  useEffect(() => {
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('dragleave', handleDragLeave)

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)
    document.addEventListener('dragend', handleDragEnd)

    return () => {
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('dragleave', handleDragLeave)

      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
      document.removeEventListener('dragend', handleDragEnd)
    }
  }, [handleDrop, handleDragEnd, handleDragOver, handleDragStart])
}
