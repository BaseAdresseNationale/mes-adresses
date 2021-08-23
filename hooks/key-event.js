import {useEffect} from 'react'

function useKeyEvent(event, handler, dependencies = []) {
  useEffect(() => {
    window.addEventListener(event, handler)

    return () => {
      window.removeEventListener(event, handler)
    }
  }, [event, handler, ...dependencies])
}

export default useKeyEvent
