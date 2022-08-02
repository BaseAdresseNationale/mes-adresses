
import {useState, useEffect, useCallback} from 'react'

import useFocus from './focus'

function useCaretPosition({initialValue, isFocus}) {
  const [focusedElement] = useFocus(isFocus)
  const [caretPosition, setCaretPosition] = useState(initialValue ? initialValue.length : 0)

  const updateCaretPosition = useCallback(() => {
    setCaretPosition(focusedElement.current.selectionStart)
    focusedElement.current.focus()
  }, [focusedElement])

  useEffect(() => {
    focusedElement.current.setSelectionRange(caretPosition + 1, caretPosition + 1)
  }, [caretPosition, isFocus, focusedElement])

  return {ref: focusedElement, updateCaretPosition}
}

export default useCaretPosition
