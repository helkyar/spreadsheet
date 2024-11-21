import { useEffect } from 'react'
import { useMatrix } from '@/context/matrix/useMatrix'
import {
  $,
  getCell,
  getCellCoordinates,
  getInput,
  manageBoundaryClassName,
  updateCell,
} from '@/context/table/utils/cell'
import { parseFilesToMatrix } from '@/context/table/utils/file'
import { HTMLCell, HTMLInput, Selected } from '@/context/table/data/types'
import { inputTag, outputTag } from '@/context/table/data/constants'

export function useDraggable(
  selectedElements: Selected,
  removeSelection: () => void
) {
  const { createNewMatrix } = useMatrix()

  const updateAsyncCell = (
    { x, y }: { x: number; y: number },
    value: string
  ) => {
    //FIX_ME: hack to wait for cell to update after drop before updating the cell value
    setTimeout(() => {
      const cell = getCell({ x, y })
      updateCell(cell, value)
    }, 0)
  }

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()

      const target = event.target as HTMLElement
      if (target.tagName !== inputTag && target.tagName !== outputTag) return
      const cell = target.parentNode as HTMLCell

      const coordinates = getCellCoordinates(cell)
      const boundary = manageBoundaryClassName(selectedElements, coordinates)
      const { removeCellBoundary, addCellBoundary } = boundary

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
        const x = finalX + (elX - initialX)
        const y = finalY + (elY - initialY)

        const value = getInput(el)?.value
        updateCell(el, '')
        updateAsyncCell({ x, y }, value)
      })
      finalCell.focus()
    }

    const handleDragStart = (event: DragEvent) => {
      if (!selectedElements) return
      const ghost = $('#ghost')

      for (let i = 0; i < selectedElements.length; i++) {
        if (i > 20) break

        const el = selectedElements[i]
        const clone = el.cloneNode(false) as HTMLCell
        Object.assign(clone.style, {
          background: 'var(--selected-cell-background)',
          position: 'absolute',
          top: `${i * 3}px`,
          left: `${i * 3}px`,
          zIndex: `${999 - i * 5}`,
          width: `${el.offsetWidth}px`,
          height: `${el.offsetHeight}px`,
        })
        ghost.appendChild(clone)
      }

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
