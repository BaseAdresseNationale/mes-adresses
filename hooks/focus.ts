import {useState, useRef, useEffect} from 'react'

function useFocus(autofocus = false): [React.RefObject<HTMLInputElement>, React.Dispatch<React.SetStateAction<boolean>>] {
  const ref = useRef<HTMLInputElement>()
  const [isFocus, setIsFocus] = useState<boolean>(autofocus)

  useEffect(() => {
    if (ref?.current && isFocus) {
      ref.current.focus()
    }
  }, [ref, isFocus])

  return [ref, setIsFocus]
}

export default useFocus
