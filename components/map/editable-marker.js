import React, {useCallback, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, MapMarkerIcon, Text} from 'evergreen-ui'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import length from '@turf/length'
import lineSlice from '@turf/line-slice'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

function EditableMarker({size, style, voie}) {
  const {markers, updateMarker, setOverrideText} = useContext(MarkersContext)
  const {editingItem} = useContext(BalDataContext)
  const [suggestedNumero, setSuggestedNumero] = useState(null)

  const onDragEnd = useCallback((event, idx) => {
    const [longitude, latitude] = event.lngLat
    const {_id, type} = markers[idx]

    setOverrideText(suggestedNumero)
    updateMarker(_id, {longitude, latitude, type})
  }, [markers, updateMarker, setOverrideText, suggestedNumero])

  const onDrag = useCallback(event => {
    const [longitude, latitude] = event.lngLat

    const numeroSuggestion = () => {
      if (voie.trace) {
        const {trace} = voie
        const point = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
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
        return slicedLine.toFixed(0)
      }
    }

    setSuggestedNumero(numeroSuggestion)
  }, [voie])

  useEffect(() => {
    if (markers.length === 0) {
      setSuggestedNumero(null)
      return null
    }
  }, [markers])

  return (
    markers.map((marker, idx) => (
      <Marker
        key={marker._id}
        {...marker}
        draggable
        onDrag={e => onDrag(e)}
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
            {editingItem ? `${editingItem.numero} - ` : suggestedNumero && `${suggestedNumero} - `}{marker.type}
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
