import {useEffect, useCallback, useContext} from 'react'
import DrawContext from '@/contexts/draw'
import PropTypes from 'prop-types'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

const draw = new MapboxDraw({
  displayControlsDefault: false,
  defaultMode: 'simple_select'
})

function DrawControl({map, isMapLoaded}) {
  const {drawEnabled, setData} = useContext(DrawContext)

  useEffect(() => {
    if (isMapLoaded) {
      if (drawEnabled) {
        draw.changeMode('draw_line_string')
      } else {
        draw.changeMode('simple_select')
      }
    }
  }, [drawEnabled, map, isMapLoaded])

  useEffect(() => {
    map?.addControl(draw)

    map?.on('draw.create', updateArea)
  }, [map, updateArea])

  const updateArea = useCallback(e => {
    console.log(e)
    const data = draw.getAll()
    if (data) {
      setData(data[0])
    }

    console.log(data)
  }, [])

  return null
}

DrawControl.propTypes = {
  map: PropTypes.object.isRequired,
  isMapLoaded: PropTypes.bool.isRequired
}

export default DrawControl
