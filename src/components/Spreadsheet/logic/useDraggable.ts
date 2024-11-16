import { useEffect } from 'react'
import { HTMLCell, HTMLInput } from '@/components/Spreadsheet/data/types'
import { useMatrix } from '@/context/matrix/useMatrix'
import { inputTag } from '@/components/Spreadsheet/data/constants'
import {
  getCell,
  getCurrentCellCoordinates,
  getInput,
  updateCell,
} from '@/components/Spreadsheet/utils/cell'
import { parseFilesToMatrix } from '@/components/Spreadsheet/utils/file'

export function useDraggable(
  selectedElements: NodeListOf<HTMLCell>,
  removeSelection: () => void
) {
  const { createNewMatrix } = useMatrix()

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      //TO_DO: generate preview adding cell border same logic for selection border
    }

    function handleDragLeave(event: MouseEvent) {
      event.preventDefault()
    }

    const handleDropFromDesktop = (event: DragEvent) => {
      const { dataTransfer } = event

      if (dataTransfer?.types.includes('Files')) {
        const { files } = dataTransfer
        parseFilesToMatrix(files, createNewMatrix)
      }
    }

    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      handleDropFromDesktop(event)

      if (!selectedElements) return

      const input = event.target as HTMLInput
      if (input.tagName !== inputTag) return
      const finalCell = input.parentNode as HTMLCell

      const { x: finalX, y: finalY } = getCurrentCellCoordinates(finalCell)
      const { x: initialX, y: initialY } = getCurrentCellCoordinates(
        selectedElements[0]
      )

      selectedElements.forEach((el) => {
        const { x: elX, y: elY } = getCurrentCellCoordinates(el)

        if (elX === finalX && elY === finalY) return

        const cell = getCell({
          x: finalX + (elX - initialX),
          y: finalY + (elY - initialY),
        })

        const value = getInput(el).value
        updateCell(el, '')
        updateCell(cell, value)
      })
      finalCell.focus()
    }

    const handleDragStart = (event: DragEvent) => {
      const ghost = document.getElementById('ghost')

      selectedElements.forEach((el, i) => {
        const clone = el.cloneNode(true) as HTMLCell
        Object.assign(clone.style, {
          background: 'var(--selected)',
          position: 'absolute',
          top: `${i * 3}px`,
          left: `${i * 3}px`,
          zIndex: `${999999 - i * 5}`,
          width: `${el.offsetWidth}px`,
          height: `${el.offsetHeight}px`,
        })
        ghost?.appendChild(clone)
      })

      if (!event.dataTransfer) return
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setDragImage(ghost || selectedElements[0], -10, -10)
    }

    const handleDragEnd = () => {
      if (!selectedElements) return
      const ghost = document.getElementById('ghost')
      selectedElements.forEach(() => {
        ghost?.removeChild(ghost.firstChild as Node)
      })

      removeSelection()
    }

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
  }, [selectedElements, removeSelection, createNewMatrix])
}
