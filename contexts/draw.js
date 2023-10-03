import React, {useState, useEffect, useMemo, useCallback} from 'react'

const DrawContext = React.createContext()

export function DrawContextProvider(props) {
  const [drawEnabled, setDrawEnabled] = useState(false)
  const [modeId, setModeId] = useState(null)
  const [hint, setHint] = useState(null)
  const [data, setData] = useState(null)
  const [voie, setVoie] = useState(null)

  const enableDraw = useCallback(voie => {
    setVoie(voie)
    setDrawEnabled(true)
  }, [])

  useEffect(() => {
    if (voie?.trace) {
      setData({
        type: 'Feature',
        properties: {},
        geometry: voie.trace
      })
    } else {
      setData(null)
    }
  }, [voie])

  useEffect(() => {
    if (drawEnabled) {
      if (data) { // Edition mode
        setModeId('editing')
        setHint('Modifier le tracé de la voie directement depuis la carte.')
      } else { // Creation mode
        setModeId('drawLineString')
        setHint('Cliquez sur la carte pour indiquer le début de la voie, puis ajouter de nouveaux points afin de tracer votre voie. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin de la voie.')
      }
    } else { // Reset states
      setModeId(null)
      setHint(null)
      setVoie(null)
      setData(null)
    }
  }, [drawEnabled, data])

  const value = useMemo(() => ({
    drawEnabled,
    enableDraw,
    disableDraw: () => setDrawEnabled(false),
    modeId,
    setModeId,
    hint,
    setHint,
    data,
    setData
  }), [
    enableDraw,
    drawEnabled,
    modeId,
    hint,
    data
  ])

  return (
    <DrawContext.Provider value={value} {...props} />
  )
}

export const DrawContextConsumer = DrawContext.Consumer

export default DrawContext
