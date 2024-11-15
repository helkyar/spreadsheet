import { inputTag, parentTag } from '@/components/Spreadsheet/data/constants'
import { HTMLCell, HTMLInput } from '@/components/Spreadsheet/data/types'
import {
  getCell,
  getCurrentCellCoordinates,
  getInput,
  parseFilesToMatrix,
} from '@/components/Spreadsheet/logic/cellUtils'
import { useMatrix } from '@/context/matrix/useMatrix'
import { useCallback, useEffect, useRef } from 'react'

export function useMouse(
  selectedElements: NodeListOf<HTMLCell>,
  addSelectionArea: (elFirst: HTMLCell, el: HTMLCell) => void,
  removeSelection: () => void
) {
  const { createNewMatrix } = useMatrix()
  const firstElement = useRef<HTMLCell | null>(null)
  const isDrag = useRef<boolean>(false)

  const mouseDown = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (target.tagName !== parentTag) return

      const isTargetSelected = selectedElements
        ? Array.from(selectedElements)?.some((el) => el === target)
        : false

      if (isTargetSelected) return

      firstElement.current = target
    },
    [selectedElements]
  )

  const mouseDrag = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const target = (event.target as HTMLElement).parentElement as HTMLCell
      if (!firstElement.current || target.tagName !== parentTag) return
      isDrag.current = true

      addSelectionArea(firstElement.current, target)
    },
    [addSelectionArea]
  )

  const mouseUp = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (!isDrag.current) removeSelection()
      firstElement.current = null
      isDrag.current = false
    },
    [removeSelection]
  )

  useEffect(() => {
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseDrag)
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseDrag)
      document.removeEventListener('mouseup', mouseUp)
    }
  }, [mouseDrag, mouseDown, mouseUp])

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    // preview???
    // handleDragOverFromDesktop(event)
  }, [])
  // function handleDragOverFromDesktop(event: DragEvent) {
  // const { currentTarget, dataTransfer } = event
  // if (dataTransfer.types.includes('Files')) {
  //   currentTarget.classList.add('drag-files')
  // }
  // }

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
    console.log(
      '🚀 ~ handleDragEnd ~ ghost?.childElementCount:',
      ghost?.childElementCount
    )

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
