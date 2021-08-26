import {useState, useEffect, useMemo} from 'react'
import Fuse from 'fuse.js'

import {useDebouncedCallback} from 'use-debounce'

function useFuse(source, delay, options) {
  const [filtered, setFiltered] = useState(source || [])

  const fuse = useMemo(() => {
    return new Fuse(source, {
      threshold: 0.4,
      ...options
    })
  }, [options, source])

  useEffect(() => {
    setFiltered(source)
  }, [source])

  const [debouncedCallback] = useDebouncedCallback(
    value => {
      if (fuse) {
        setFiltered(value ? fuse.search(value) : source)
      }
    },
    delay,
    [source, fuse]
  )

  return [filtered, debouncedCallback]
}

export default useFuse
