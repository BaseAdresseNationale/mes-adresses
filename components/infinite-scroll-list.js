import {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Spinner} from 'evergreen-ui'

const LIMIT = 15

function InfiniteScrollList({items, children}) {
  const [limit, setLimit] = useState(LIMIT)

  const handleScroll = useCallback(({target}) => {
    const isAtTop = target.scrollTop === 0

    // Reset limit
    if (isAtTop) {
      setLimit(LIMIT)
    }

    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight

    // Increase limit
    if (isAtBottom) {
      setLimit(limit => limit + LIMIT)
    }
  }, [])

  useEffect(() => {
    setLimit(LIMIT)
  }, [items])

  return (
    <Pane height={640} overflowY='scroll' onScroll={handleScroll}>
      <Pane display='flex' flexDirection='column' flex={1}>
        {items.slice(0, limit).map(numero => (
          children(numero)
        ))}

        {limit < items.length && (
          <Pane display='flex' justifyContent='center' marginY={8}><Spinner /></Pane>
        )}
      </Pane>
    </Pane>
  )
}

InfiniteScrollList.propTypes = {
  items: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired
}

export default InfiniteScrollList
