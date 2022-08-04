import {useState, useRef, useEffect} from 'react'

function useFocus(autofocus = false) {
  const ref = useRef()
  const [isFocus, setIsFocus] = useState(autofocus)

  useEffect(() => {
    if (ref?.current && isFocus) {
      ref.current.focus()
    }
  }, [ref, isFocus])

  return [ref, setIsFocus]
}

export default useFocus
