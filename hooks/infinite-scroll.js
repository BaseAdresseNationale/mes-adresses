import {useState, useCallback, useMemo} from 'react'

export default function useInfiniteScroll(initialItems, initialLimit = 15) {
  const [limit, setLimit] = useState(initialLimit)
  const [items, setItems] = useState(initialItems)

  const list = useMemo(() => {
    return items.slice(0, limit)
  }, [items, limit])

  const handleScroll = useCallback(({target}) => {
    const isAtTop = target.scrollTop === 0

    // Reset limit
    if (isAtTop) {
      setLimit(initialLimit)
    }

    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight

    // Increase limit
    if (isAtBottom) {
      setLimit(limit => limit + initialLimit)
    }
  }, [initialLimit])

  return [list, handleScroll, setItems, limit]
}
