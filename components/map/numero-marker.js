import React, {useMemo, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, Text, Menu, Position, WarningSignIcon, TrashIcon, EndorsedIcon} from 'evergreen-ui'
import {Tooltip} from 'evergreen-ui/commonjs/tooltip'
import randomColor from 'randomcolor'
import {css} from 'glamor'

import {removeNumero} from '../../lib/bal-api'

import useError from '../../hooks/error'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

function NumeroMarker({numero, colorSeed, showLabel, showContextMenu, setShowContextMenu}) {
  const [setError] = useError()

  const {token} = useContext(TokenContext)
  const {setEditingId, isEditing, reloadNumeros} = useContext(BalDataContext)

  const onEnableEditing = useCallback(e => {
    e.stopPropagation()

    if (!isEditing) {
      setEditingId(numero._id)
    }
  }, [setEditingId, isEditing, numero])

  const position = numero.positions.find(position => position.type === 'entrée') || numero.positions[0]

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
      await removeNumero(_id, token)
      await reloadNumeros()
    } catch (error) {
      setError(error.message)
    }

    setShowContextMenu(false)
  })

  if (!position) {
    return null
  }

  const {coordinates} = position.point

  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
      <Pane {...markerStyle} paddingX={4} onClick={onEnableEditing} onContextMenu={() => setShowContextMenu(numero._id)}>
        <Text color='white' marginLeft={8} marginRight={4}>
          {numero.numeroComplet}
        </Text>

        {numero.positions.find(position => position.type === 'inconnue') && (
          <Tooltip content='Le type d’une position est inconnu' position={Position.BOTTOM_RIGHT}>
            <WarningSignIcon color='warning' size={13} marginX={4} marginBottom={2} style={{verticalAlign: 'middle'}} />
          </Tooltip>
        )}

        {numero.certifie && (
          <Tooltip content='Cette adresse est certifiée par la commune' position={Position.RIGHT}>
            <EndorsedIcon color='success' size={13} marginX={4} style={{verticalAlign: 'text-top'}} />
          </Tooltip>
        )}
      </Pane>

      {showContextMenu && (
        <Pane background='tint1' position='absolute' margin={10}>
          <Menu>
            <Menu.Group>
              <Menu.Item icon={TrashIcon} intent='danger' onSelect={removeAddress}>
                Supprimer…
              </Menu.Item>
            </Menu.Group>
          </Menu>
        </Pane>
      )}
    </Marker>
  )
}

NumeroMarker.propTypes = {
  numero: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    certifie: PropTypes.bool.isRequired,
    numeroComplet: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.shape({
      point: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
      }).isRequired,
      type: PropTypes.string
    }))
  }).isRequired,
  colorSeed: PropTypes.string,
  showLabel: PropTypes.bool,
  showContextMenu: PropTypes.bool,
  setShowContextMenu: PropTypes.func.isRequired
}

NumeroMarker.defaultProps = {
  colorSeed: null,
  showLabel: false,
  showContextMenu: false
}

export default React.memo(NumeroMarker)
