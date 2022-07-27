
import {useState, useRef, useEffect, useCallback} from 'react'

import useFocus from './focus'

function useCaretPosition({initialValue, isFocus}) {
  const [focusedElement] = useFocus({value: null, isFocus})
  const value = useRef(initialValue) // Save initial input value state on first render

  const [start, setStart] = useState(value.current ? value.current.length : 0)
  const [end, setEnd] = useState(value.current ? value.current.length : 0)

  const updateCaretPosition = useCallback(() => {
    if (focusedElement && focusedElement.current) {
      const {selectionStart, selectionEnd} = focusedElement.current

      setStart(selectionStart)
      setEnd(selectionEnd)

      focusedElement.current.focus()
    }
  }, [focusedElement])

  useEffect(() => {
    if (focusedElement && focusedElement.current) {
      const newCursorPosition = start + 1
      focusedElement.current.setSelectionRange(newCursorPosition, newCursorPosition)
    }
  }, [start, end, isFocus, focusedElement])

  return {ref: focusedElement, updateCaretPosition}
}

export default useCaretPosition
