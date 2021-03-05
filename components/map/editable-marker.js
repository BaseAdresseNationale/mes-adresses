import React, {useCallback, useContext, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, MapMarkerIcon, Text} from 'evergreen-ui'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import length from '@turf/length'
import lineSlice from '@turf/line-slice'

import MarkersContext from '../../contexts/markers'

function EditableMarker({size, style, voie, isToponyme, viewport}) {
  const {markers, updateMarker, overrideText, suggestedNumero, setSuggestedNumero} = useContext(MarkersContext)

  const numberToDisplay = !isToponyme && (overrideText || suggestedNumero)
  const isSuggestionNeeded = useMemo(() => {
    return !isToponyme && !overrideText && voie && voie.typeNumerotation === 'metrique' && voie.trace
  }, [isToponyme, overrideText, voie])

  const computeSuggestedNumero = useCallback(coordinates => {
    if (isSuggestionNeeded) {
      const {trace} = voie
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
          coordinates: trace.coordinates[0]
        }
      }

      const to = nearestPointOnLine({type: 'Feature', geometry: trace}, point, {units: 'kilometers'})
      const slicedLine = length(lineSlice(from, to, trace)) * 1000

      setSuggestedNumero(slicedLine.toFixed())
    }
  }, [isSuggestionNeeded, voie, setSuggestedNumero])

  const onDragEnd = useCallback((event, idx) => {
    const [longitude, latitude] = event.lngLat
    const {_id, type} = markers[idx]

    computeSuggestedNumero(event.lngLat)
    updateMarker(_id, {longitude, latitude, type})
  }, [markers, updateMarker, computeSuggestedNumero])

  const onDrag = (event, idx) => {
    if (idx === 0) {
      computeSuggestedNumero(event.lngLat)
    }
  }

  useEffect(() => {
    if (markers.length === 0) {
      return null
    }
  }, [markers])

  useEffect(() => {
    const {longitude, latitude} = viewport
    if (!suggestedNumero) {
      computeSuggestedNumero([longitude, latitude])
    }
  }, [computeSuggestedNumero, suggestedNumero, viewport])

  return (
    markers.map((marker, idx) => (
      <Marker
        key={marker._id}
        {...marker}
        draggable
        onDrag={e => onDrag(e, idx)}
        onDragEnd={e => onDragEnd(e, idx)}
      >
        <Pane>
          <Text
            position='absolute'
            top={-62}
            transform='translate(-50%)'
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
            transform='translate(-50%, -100%)'
            size={size}
          />
        </Pane>
      </Marker>
    ))
  )
}

EditableMarker.propTypes = {
  size: PropTypes.number,
  style: PropTypes.string
}

EditableMarker.defaultProps = {
  size: 32,
  style: 'vector'
}

export default EditableMarker
