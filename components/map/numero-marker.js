import React, {useMemo, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, Text} from 'evergreen-ui'
import {css} from 'glamor' // eslint-disable-line import/no-extraneous-dependencies

import MarkerContext from '../../contexts/marker'
import BalDataContext from '../../contexts/bal-data'

function NumeroMarker({numero, labelProperty, showLabel}) {
  const {marker} = useContext(MarkerContext)
  const {editingId, setEditingId} = useContext(BalDataContext)

  const onEnableEditing = useCallback(e => {
    e.stopPropagation()

    setEditingId(numero._id)
  }, [setEditingId, numero])

  const position = numero.positions[0]

  const markerStyle = useMemo(() => css({
    borderRadius: 20,
    marginTop: -10,
    marginLeft: -10,
    color: 'transparent',
    whiteSpace: 'nowrap',
    background: showLabel ? 'rgba(0, 0, 0, 0.7)' : null,
    cursor: 'pointer',

    '&:before': {
      content: ' ',
      backgroundColor: '#1070ca',
      border: '1px solid white',
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      marginLeft: 6
    },

    '& > span': {
      display: showLabel ? 'inline-block' : 'none'
    },

    '&:hover': showLabel ? null : {
      background: 'rgba(0, 0, 0, 0.7)',

      '& > span': {
        display: 'inline-block'
      }
    }
  }), [showLabel])

  if (!position) {
    return null
  }

  if (marker && editingId === numero._id) {
    return null
  }

  const {coordinates} = position.point

  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
      <Pane className={markerStyle} onClick={onEnableEditing}>
        <Text color='white' paddingLeft={8} paddingRight={10}>
          {numero[labelProperty]}
        </Text>
      </Pane>
    </Marker>
  )
}

NumeroMarker.propTypes = {
  numero: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.shape({
      point: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
      }).isRequired
    }))
  }).isRequired,
  labelProperty: PropTypes.string,
  showLabel: PropTypes.bool
}

NumeroMarker.defaultProps = {
  labelProperty: 'numeroComplet',
  showLabel: false
}

export default React.memo(NumeroMarker)
