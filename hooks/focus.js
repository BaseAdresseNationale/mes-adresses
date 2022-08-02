import {useRef, useEffect} from 'react'

function useFocus(isFocus) {
  const focusedElement = useRef()

  useEffect(() => {
    if (focusedElement?.current && isFocus) {
      focusedElement.current.focus()
    }
  }, [isFocus])

  return [focusedElement]
}

export default useFocus
