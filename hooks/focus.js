import {useRef, useEffect} from 'react'

function useFocus({value, isFocus}) {
  const focusedElement = useRef(value || null)

  useEffect(() => {
    if (focusedElement?.current && isFocus) {
      focusedElement.current.focus()
    }
  }, [isFocus])

  return [focusedElement]
}

export default useFocus
