import React, {useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, Icon, Text} from 'evergreen-ui'

import MarkerContext from '../../contexts/marker'
import BalDataContext from '../../contexts/bal-data'

function EditableMarker({viewport, size}) {
  const {enabled, marker, setMarker} = useContext(MarkerContext)
  const {editingItem} = useContext(BalDataContext)

  const onDrag = useCallback(event => {
    setMarker(marker => ({
      ...marker,
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    }))
  }, [setMarker])

  useEffect(() => {
    if (enabled) {
      setMarker(marker => marker || {
        latitude: viewport.latitude,
        longitude: viewport.longitude
      })
    }
  }, [enabled, setMarker])

  if (!enabled || !marker) {
    return null
  }

  return (
    <Marker
      {...marker}
      draggable
      onDrag={onDrag}
    >
      <Pane>
        {editingItem && (
          <Text
            position='absolute'
            top={-58}
            transform='translate(-50%)'
            borderRadius={20}
            backgroundColor='rgba(0, 0, 0, 0.7)'
            color='white'
            paddingX={8}
            whiteSpace='nowrap'
          >
            {editingItem.nom || editingItem.numeroComplet}
          </Text>
        )}

        <Icon
          icon='map-marker'
          filter='drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))'
          color='info'
          transform='translate(-50%, -100%)'
          size={size}
        />
      </Pane>
    </Marker>
  )
}

EditableMarker.propTypes = {
  size: PropTypes.number
}

EditableMarker.defaultProps = {
  size: 32
}

export default EditableMarker
