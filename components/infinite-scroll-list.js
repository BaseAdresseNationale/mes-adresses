import {useState, useEffect, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'
import {Pane, Spinner} from 'evergreen-ui'

const ELEMENT_HEIGHT = 48

function InfiniteScrollList({items, children}) {
  const [limit, setLimit] = useState(5)

  const visibleElements = useRef()
  const containerRef = useRef()

  const handleScroll = useCallback(({target}) => {
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight

    // Increase limit
    if (isAtBottom) {
      setLimit(limit => limit + visibleElements.current)
    }
  }, [])

  useEffect(() => {
    setLimit(visibleElements.current)
  }, [items])

  useEffect(() => {
    function updateMaxVisibleElements() {
      visibleElements.current = Math.ceil(containerRef.current.offsetHeight / ELEMENT_HEIGHT)
      setLimit(visibleElements.current)
    }

    if (containerRef.current) {
      updateMaxVisibleElements()
      window.addEventListener('resize', updateMaxVisibleElements)
    }

    return () => {
      window.removeEventListener('resize', updateMaxVisibleElements)
    }
  }, [])

  return (
    <Pane ref={containerRef} display='flex' flex={1} flexDirection='column' overflowY='scroll' onScroll={handleScroll}>
      {items.slice(0, limit).map(numero => (
        children(numero)
      ))}

      {limit < items.length && (
        <Pane display='flex' justifyContent='center' marginY={8}><Spinner /></Pane>
      )}
    </Pane>
  )
}

InfiniteScrollList.propTypes = {
  items: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired
}

export default InfiniteScrollList