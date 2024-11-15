import {
  inputTag,
  parentTag,
  supportedFileTypes,
} from '@/components/Spreadsheet/data/constants'
import { HTMLCell, HTMLInput } from '@/components/Spreadsheet/data/types'
import {
  formatTextToCellValues,
  getCell,
  getCurrentCellCoordinates,
  getInput,
} from '@/components/Spreadsheet/logic/cellUtils'
import { toast } from '@/components/ui/toast'
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

  const mouseDown = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    const target = (event.target as HTMLElement).parentElement as HTMLCell
    if (target.tagName !== parentTag) return
    firstElement.current = target
  }, [])

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
  console.log(
    '🚀 ~ mouseDrag:',
    () => mouseDrag,
    () => mouseDown,
    () => mouseUp
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

  const draggedElement = useRef<HTMLInput | null>(null)
  const sourceContainer = useRef<HTMLCell | null>(null)

  function handleDragStart(event: DragEvent) {
    const input = event.target as HTMLInput
    if (input.tagName !== inputTag) return

    //   get selected values

    draggedElement.current = input
    sourceContainer.current = draggedElement.current.parentNode as HTMLCell
    event.dataTransfer?.setData('text/plain', draggedElement.current.value)
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    handleDragOverFromDesktop(event)

    // const currentTarget = event.currentTarget as HTMLElement

    // if (sourceContainer.current === currentTarget) return

    // currentTarget?.classList.add('drag-over')

    // const dragPreview = document.querySelector('.drag-preview')

    // if (draggedElement.current && !dragPreview) {
    //   const previewElement = draggedElement.current.cloneNode(
    //     true
    //   ) as HTMLElement
    //   previewElement.classList.add('drag-preview')
    //   currentTarget?.appendChild(previewElement)
    // }
  }

  function handleDragLeave(event: MouseEvent) {
    event.preventDefault()

    // const currentTarget = event.currentTarget as HTMLElement
    // currentTarget?.classList.remove('drag-over')
    // currentTarget?.querySelector('.drag-preview')?.remove()
  }

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

      // const dataTransfer = event.dataTransfer as DataTransfer

      // if (sourceContainer.current && draggedElement.current) {
      //   draggedElement.current.value = ''
      //   getOutput(sourceContainer.current).innerText = ''
      // }

      // if (draggedElement.current) {
      //   const value = dataTransfer?.getData('text/plain')
      //   input.value = value
      //   input.focus()
      //   input.blur()
      // }

      // currentTarget.classList.remove('drag-over')
      // currentTarget.querySelector('.drag-preview')?.remove()
    },
    [selectedElements]
  )

  function handleDragEnd() {
    draggedElement.current = null
    sourceContainer.current = null
  }

  function handleDragOverFromDesktop(event: DragEvent) {
    // const { currentTarget, dataTransfer } = event
    // if (dataTransfer.types.includes('Files')) {
    //   currentTarget.classList.add('drag-files')
    // }
  }

  function handleDropFromDesktop(event: DragEvent) {
    const { currentTarget, dataTransfer } = event

    if (dataTransfer?.types.includes('Files')) {
      //   currentTarget.classList.remove('drag-files')
      const { files } = dataTransfer
      parseFiles(files)
      //   useFilesToCreateItems(files)
    }
  }

  function parseFiles(files: FileList) {
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      if (!supportedFileTypes.includes(file.type)) {
        toast.error('Unsupported file type')
        return
      }

      const reader = new FileReader()
      reader.onload = (eventReader) => {
        const { result } = eventReader.target as FileReader
        const matrix = formatTextToCellValues(result as string)
        createNewMatrix(matrix)
      }

      reader.readAsText(file as Blob)
    })
  }

  useEffect(() => {
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('dragend', handleDragEnd)

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)
    document.addEventListener('dragleave', handleDragLeave)

    return () => {
      // Cells
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('dragend', handleDragEnd)
      // Table
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
      document.removeEventListener('dragleave', handleDragLeave)
    }
  }, [handleDrop])
}
