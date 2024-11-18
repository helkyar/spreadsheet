import { useEffect } from 'react'
import {
  HTMLCell,
  HTMLInput,
  Selected,
} from '@/components/Spreadsheet/data/types'
import { useMatrix } from '@/context/matrix/useMatrix'
import {
  inputTag,
  outputTag,
  parentTag,
} from '@/components/Spreadsheet/data/constants'
import {
  $,
  getCell,
  getCellCoordinates,
  getInput,
  manageBoundaryClassName,
  updateCell,
} from '@/components/Spreadsheet/utils/cell'
import { parseFilesToMatrix } from '@/components/Spreadsheet/utils/file'

export function useDraggable(
  selectedElements: Selected,
  removeSelection: () => void
) {
  const { createNewMatrix } = useMatrix()

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      const target = event.target as HTMLElement
      if (target.tagName !== inputTag && target.tagName !== outputTag) return
      const cell = target.parentNode as HTMLCell
      const coordinates = getCellCoordinates(cell)
      const { removeCellBoundary, addCellBoundary } = manageBoundaryClassName(
        selectedElements,
        coordinates
      )
      if (removeCellBoundary) removeCellBoundary()
      if (addCellBoundary) addCellBoundary()
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

      const target = event.target as HTMLInput
      if (target.tagName !== inputTag && target.tagName !== outputTag) return
      const finalCell = target.parentNode as HTMLCell

      const { x: finalX, y: finalY } = getCellCoordinates(finalCell)
      const { x: initialX, y: initialY } = getCellCoordinates(
        selectedElements[0]
      )

      selectedElements.forEach(async (el) => {
        const { x: elX, y: elY } = getCellCoordinates(el)

        if (finalX === initialX && finalY === initialY) return

        const value = getInput(el).value
        updateCell(el, '')

        //FIX_ME: hack to wait for cell to update after drop before updating the cell value
        setTimeout(() => {
          const cell = getCell({
            x: finalX + (elX - initialX),
            y: finalY + (elY - initialY),
          })
          updateCell(cell, value)
        }, 0)
      })
      finalCell.focus()
    }

    const handleDragStart = (event: DragEvent) => {
      const ghost = $('#ghost')

      selectedElements?.forEach((el, i) => {
        if (el.tagName !== parentTag) return
        const clone = el.cloneNode(false) as HTMLCell
        Object.assign(clone.style, {
          background: 'var(--selected-cell-background)',
          position: 'absolute',
          top: `${i * 3}px`,
          left: `${i * 3}px`,
          zIndex: `${999999 - i * 5}`,
          width: `${el.offsetWidth}px`,
          height: `${el.offsetHeight}px`,
        })
        ghost.appendChild(clone)
      })

      if (!event.dataTransfer) return
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setDragImage(ghost, -10, -10)
    }

    const handleDragEnd = () => {
      if (!selectedElements) return

      $('#ghost').innerHTML = ''

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
