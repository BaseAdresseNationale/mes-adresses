import React, {useMemo, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, Text, Menu, Icon, Position} from 'evergreen-ui'
import {Tooltip} from 'evergreen-ui/commonjs/tooltip'
import randomColor from 'randomcolor'
import {css} from 'glamor'

import {removeNumero, removeVoie} from '../../lib/bal-api'

import useError from '../../hooks/error'

import TokenContext from '../../contexts/token'
import MarkerContext from '../../contexts/marker'
import BalDataContext from '../../contexts/bal-data'

function NumeroMarker({numero, labelProperty, colorSeed, showLabel, showContextMenu, setShowContextMenu}) {
  const [setError] = useError()

  const {token} = useContext(TokenContext)
  const {marker} = useContext(MarkerContext)
  const {editingId, setEditingId, reloadNumeros, reloadVoies} = useContext(BalDataContext)

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
    display: 'flex',
    alignItems: 'center',

    '&:before': {
      content: ' ',
      backgroundColor: colorSeed ? randomColor({
        luminosity: 'dark',
        seed: colorSeed
      }) : '#1070ca',
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
  }), [colorSeed, showLabel])

  const removeAddress = (async () => {
    const {_id} = numero

    try {
      if (numero.numero) {
        await removeNumero(_id, token)
        await reloadNumeros()
      } else {
        await removeVoie(_id, token)
        await reloadVoies()
      }
    } catch (error) {
      setError(error.message)
    }

    setShowContextMenu(false)
  })

  if (!position) {
    return null
  }

  if (marker && editingId === numero._id) {
    return null
  }

  const {coordinates} = position.point

  return (
    <>
      <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
        {numero.positions[0].type === 'inconnue' ? (
          <Tooltip content='Le type de la position est inconnu' position={Position.RIGHT}>
            <Pane className={markerStyle} onClick={onEnableEditing} onContextMenu={() => setShowContextMenu(numero._id)}>
              <Text color='white' paddingLeft={8} paddingRight={5}>
                {numero[labelProperty]}
              </Text>
              <Text color='yellow' paddingRight={5} fontSize={20}>
                <Icon icon='warning-sign' color='warning' />
              </Text>
            </Pane>
          </Tooltip>
        ) : (
          <Pane className={markerStyle} onClick={onEnableEditing} onContextMenu={() => setShowContextMenu(numero._id)}>
            <Text color='white' paddingLeft={8} paddingRight={5}>
              {numero[labelProperty]}
            </Text>
          </Pane>
        )}
        {showContextMenu && (
          <Pane background='tint1' position='absolute' margin={10}>
            <Menu>
              <Menu.Group>
                <Menu.Item icon='trash' intent='danger' onSelect={removeAddress}>
                  Supprimer…
                </Menu.Item>
              </Menu.Group>
            </Menu>
          </Pane>
        )}
      </Marker>
    </>
  )
}

NumeroMarker.propTypes = {
  numero: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.shape({
      point: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
      }).isRequired,
      type: PropTypes.string
    }))
  }).isRequired,
  labelProperty: PropTypes.string,
  colorSeed: PropTypes.string,
  showLabel: PropTypes.bool,
  showContextMenu: PropTypes.bool,
  setShowContextMenu: PropTypes.func.isRequired
}

NumeroMarker.defaultProps = {
  labelProperty: 'numeroComplet',
  colorSeed: null,
  showLabel: false,
  showContextMenu: false
}

export default React.memo(NumeroMarker)
