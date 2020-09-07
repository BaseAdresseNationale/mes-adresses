import React, {useState, useEffect, useContext} from 'react'

import BalDataContext from './bal-data'

const DrawContext = React.createContext()

export function DrawContextProvider(props) {
  const [drawEnabled, setDrawEnabled] = useState(false)
  const [modeId, setModeId] = useState(null)
  const [hint, setHint] = useState(null)
  const [data, setData] = useState(null)

  const {editingItem} = useContext(BalDataContext)

  useEffect(() => {
    if (modeId === 'drawLineString') {
      setHint('Indiquez le début de la voie')
    }
  }, [modeId])

  useEffect(() => {
    if (data) {
      setHint(null)
      setModeId('editing')
    }
  }, [data, setModeId])

  useEffect(() => {
    if (editingItem && editingItem.typeNumerotation === 'metric') {
      if (editingItem.trace) {
        setData(editingItem.trace)
        setModeId('editing')
      } else {
        setModeId('drawLineString')
      }
    }
  }, [editingItem])

  useEffect(() => {
    if (!drawEnabled) {
      setData(null)
      setModeId(null)
    }
  }, [drawEnabled])

  return (
    <DrawContext.Provider
      value={{
        drawEnabled,
        enableDraw: () => setDrawEnabled(true),
        disableDraw: () => setDrawEnabled(false),
        modeId,
        setModeId,
        hint,
        setHint,
        data,
        setData
      }}
      {...props}
    />
  )
}

export const DrawContextConsumer = DrawContext.Consumer

export default DrawContext
