import React, {useState, useCallback} from 'react'

const MarkerContext = React.createContext()

export function MarkerContextProvider(props) {
  const [enabled, setEnabled] = useState(false)
  const [marker, setMarker] = useState(null)

  const enableMarker = useCallback(() => {
    setEnabled(true)
  }, [])

  const disableMarker = useCallback(() => {
    setEnabled(false)
    setMarker(null)
  }, [])

  return (
    <MarkerContext.Provider
      value={{
        enabled,
        marker,
        setMarker,
        enableMarker,
        disableMarker
      }}
      {...props}
    />
  )
}

export const MarkerContextConsumer = MarkerContext.Consumer

export default MarkerContext
