import React, {useMemo, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, Text, Menu, TrashIcon} from 'evergreen-ui'
import {css} from 'glamor'

import {removeVoie} from '../../lib/bal-api'
import {getFullVoieName} from '../../lib/voie'

import useError from '../../hooks/error'

import TokenContext from '../../contexts/token'
import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

function ToponymeMarker({toponyme, showLabel, showContextMenu, setShowContextMenu}) {
  const [setError] = useError()

  const {token} = useContext(TokenContext)
  const {markers} = useContext(MarkersContext)
  const {baseLocale, editingId, setEditingId, isEditing, reloadVoies} = useContext(BalDataContext)

  const onEnableEditing = useCallback(e => {
    e.stopPropagation()

    if (!isEditing) {
      setEditingId(toponyme._id)
    }
  }, [isEditing, toponyme._id, setEditingId])

  const position = toponyme.positions[0]

  const markerStyle = useMemo(() => css({
    borderRadius: 20,
    marginTop: -10,
    marginLeft: -10,
    color: 'transparent',
    whiteSpace: 'nowrap',
    background: showLabel ? 'rgba(0, 0, 0, 0.5)' : null,
    cursor: 'pointer',

    '& > span': {
      display: showLabel ? 'inline-block' : 'none'
    }
  }), [showLabel])

  const removeAddress = (async () => {
    const {_id} = toponyme

    try {
      await removeVoie(_id, token)
      await reloadVoies()
    } catch (error) {
      setError(error.message)
    }

    setShowContextMenu(false)
  })

  if (!position) {
    return null
  }

  if (markers[0] && editingId === toponyme._id) {
    return null
  }

  const {coordinates} = position.point

  return (
    <>
      <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
        <Pane {...markerStyle} onClick={onEnableEditing} onContextMenu={() => setShowContextMenu(toponyme._id)}>
          <Text color='white' paddingLeft={8} paddingRight={10}>
            {getFullVoieName(toponyme, baseLocale.enableComplement)}
          </Text>
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
    </>
  )
}

ToponymeMarker.propTypes = {
  toponyme: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.shape({
      point: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
      }).isRequired
    }))
  }).isRequired,
  showLabel: PropTypes.bool,
  showContextMenu: PropTypes.bool,
  setShowContextMenu: PropTypes.func.isRequired
}

ToponymeMarker.defaultProps = {
  showLabel: false,
  showContextMenu: false
}

export default React.memo(ToponymeMarker)
