import React, {useState, useEffect, useCallback, useContext} from 'react'

import BalDataContext from './bal-data'

const MarkerContext = React.createContext()

export function MarkerContextProvider(props) {
  const [enabled, setEnabled] = useState(false)
  const [marker, setMarker] = useState(null)
  const [overrideText, setOverrideText] = useState(null)

  const {editingId} = useContext(BalDataContext)

  const disableMarker = useCallback(() => {
    setEnabled(false)
    setMarker(null)
    setOverrideText(null)
  }, [])

  useEffect(() => {
    if (editingId) {
      setEnabled(true)
    } else {
      disableMarker()
    }
  }, [disableMarker, editingId])

  const enableMarker = useCallback(defaultValue => {
    if (defaultValue) {
      setMarker({
        longitude: defaultValue.point.coordinates[0],
        latitude: defaultValue.point.coordinates[1]
      })
    }

    setEnabled(true)
  }, [])

  return (
    <MarkerContext.Provider
      value={{
        enabled,
        marker,
        overrideText,
        setMarker,
        enableMarker,
        setOverrideText,
        disableMarker
      }}
      {...props}
    />
  )
}

export const MarkerContextConsumer = MarkerContext.Consumer

export default MarkerContext
