import {uniqueId} from 'lodash'
import React, {useState, useEffect, useCallback, useContext} from 'react'

import BalDataContext from './bal-data'

const MarkersContext = React.createContext()

export function MarkersContextProvider(props) {
  const [enabled, setEnabled] = useState(false)
  const [markers, setMarkers] = useState([])
  const [overrideText, setOverrideText] = useState(null)

  const {editingId} = useContext(BalDataContext)

  const disableMarkers = useCallback(() => {
    setEnabled(false)
    setMarkers([])
    setOverrideText(null)
  }, [])

  useEffect(() => {
    if (editingId) {
      setEnabled(true)
    } else {
      disableMarkers()
    }
  }, [disableMarkers, editingId])

  const enableMarkers = useCallback(defaultMarkers => {
    if (defaultMarkers) {
      const markers = defaultMarkers.map(marker => {
        return {_id: uniqueId(), ...marker}
      })

      setMarkers(markers)
    }

    setEnabled(true)
  }, [])

  return (
    <MarkersContext.Provider
      value={{
        enabled,
        markers,
        overrideText,
        setMarkers,
        enableMarkers,
        setOverrideText,
        disableMarkers
      }}
      {...props}
    />
  )
}

export const MarkerContextConsumer = MarkersContext.Consumer

export default MarkersContext
