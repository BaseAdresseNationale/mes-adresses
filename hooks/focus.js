import {useState, useEffect} from 'react'

function useFocus() {
  const [ref, setRef] = useState()

  useEffect(() => {
    if (ref) {
      ref.focus()
    }
  }, [ref])

  return setRef
}

export default useFocus
