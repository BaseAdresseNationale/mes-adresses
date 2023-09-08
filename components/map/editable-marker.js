import {useState, useCallback, useContext, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, MapMarkerIcon, Text} from 'evergreen-ui'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import length from '@turf/length'
import lineSlice from '@turf/line-slice'

import MapContext from '@/contexts/map'
import MarkersContext from '@/contexts/markers'
import BalDataContext from '@/contexts/bal-data'
import {VOIE_TRACE_LINE} from '@/components/map/layers/tiles'

function EditableMarker({size, style, idVoie, isToponyme, viewport}) {
  const {map} = useContext(MapContext)
  const {markers, updateMarker, overrideText, suggestedNumero, setSuggestedNumero} = useContext(MarkersContext)
  const {isEditing} = useContext(BalDataContext)

  const [suggestedMarkerNumero, setSuggestedMarkerNumero] = useState(suggestedNumero)

  const numberToDisplay = overrideText || suggestedMarkerNumero

  const voie = useMemo(() => {
    if (idVoie) {
      return map
        .queryRenderedFeatures({layers: [VOIE_TRACE_LINE]})
        .filter(({geometry}) => geometry.type === 'LineString')
        .find(({properties}) => properties.id === idVoie)
    }
  }, [idVoie, map])

  const computeSuggestedNumero = useCallback(coordinates => {
    if (!isToponyme && !overrideText && voie && voie.properties.originalGeometry) { // Is suggestion needed
      const geometry = JSON.parse(voie.properties.originalGeometry)
      const point = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates
        }
      }
      const from = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: geometry.coordinates[0]
        }
      }

      const to = nearestPointOnLine({type: 'Feature', geometry}, point, {units: 'kilometers'})
      const slicedLine = length(lineSlice(from, to, geometry)) * 1000

      return slicedLine.toFixed()
    }
  }, [isToponyme, overrideText, voie])

  const onDragEnd = useCallback((event, idx) => {
    const {lng, lat} = event.lngLat
    const {_id, type} = markers[idx]

    setSuggestedNumero(suggestedMarkerNumero)
    updateMarker(_id, {longitude: lng, latitude: lat, type})
  }, [markers, updateMarker, suggestedMarkerNumero, setSuggestedNumero])

  const onDrag = useCallback((event, idx) => {
    if (idx === 0) {
      const suggestion = computeSuggestedNumero(event.lngLat)
      setSuggestedMarkerNumero(suggestion)
    }
  }, [setSuggestedMarkerNumero, computeSuggestedNumero])

  useEffect(() => {
    if (isEditing && !overrideText) {
      const {longitude, latitude} = viewport
      const coordinates = markers.length > 0 ?
        [markers[0].longitude, markers[0].latitude] :
        [longitude, latitude]
      const suggestion = computeSuggestedNumero(coordinates)
      setSuggestedMarkerNumero(suggestion)
      setSuggestedNumero(suggestion)
    }
  }, [isEditing, markers, overrideText, viewport, setSuggestedNumero, computeSuggestedNumero])

  return (
    markers.map((marker, idx) => (
      <Marker
        key={marker._id}
        {...marker}
        draggable
        offsetLeft={(-size / 2) + ((size / 100) * 15)} // Calculates the difference of width between the SVG size and its container
        offsetTop={-size + 1}
        onDrag={e => onDrag(e, idx)}
        onDragEnd={e => onDragEnd(e, idx)}
      >
        <Pane>
          <Text
            position='absolute'
            top={-30}
            transform={`translate(calc(-50% + ${size / 2}px), -5px)`} // Place label on top of marker
            borderRadius={20}
            backgroundColor='rgba(0, 0, 0, 0.7)'
            color='white'
            paddingX={8}
            paddingY={1}
            fontSize={10}
            whiteSpace='nowrap'
          >
            {numberToDisplay ? `${numberToDisplay} - ${marker.type}` : `${marker.type}`}
          </Text>

          <MapMarkerIcon
            filter='drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))'
            color={style === 'vector' ? 'info' : 'success'}
            size={size}
          />
        </Pane>
      </Marker>
    ))
  )
}

EditableMarker.defaultProps = {
  idVoie: null,
  size: 32,
  style: 'vector'
}

EditableMarker.propTypes = {
  idVoie: PropTypes.string,
  isToponyme: PropTypes.bool.isRequired,
  viewport: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }).isRequired,
  size: PropTypes.number,
  style: PropTypes.string
}

export default EditableMarker

