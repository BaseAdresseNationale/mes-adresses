import React, {useState, useCallback} from 'react'

const MarkerContext = React.createContext()

export function MarkerContextProvider(props) {
  const [enabled, setEnabled] = useState(false)
  const [marker, setMarker] = useState(null)

  const enableMarker = useCallback(defaultValue => {
    if (defaultValue) {
      setMarker({
        longitude: defaultValue.point.coordinates[0],
        latitude: defaultValue.point.coordinates[1]
      })
    }

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
