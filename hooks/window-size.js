import {useState, useEffect} from 'react'

const initialValue = {
  innerHeight: null,
  innerWidth: null,
  outerWidth: null,
  outerHeight: null
}

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  }
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(initialValue)

  const onResize = () => {
    setWindowSize(getSize())
  }

  useEffect(() => {
    onResize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
