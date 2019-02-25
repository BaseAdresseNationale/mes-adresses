import {useState, useEffect} from 'react'

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  }
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize())

  const onResize = () => {
    setWindowSize(getSize())
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
