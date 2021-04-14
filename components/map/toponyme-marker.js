import React, {useMemo, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {useRouter} from 'next/router'
import {Pane, Text, Menu, TrashIcon} from 'evergreen-ui'
import {css} from 'glamor'

import {removeToponyme} from '../../lib/bal-api'

import useError from '../../hooks/error'

import TokenContext from '../../contexts/token'
import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

function ToponymeMarker({initialToponyme, showLabel, showContextMenu, setShowContextMenu}) {
  const [setError] = useError()
  const router = useRouter()

  const {token} = useContext(TokenContext)
  const {markers} = useContext(MarkersContext)
  const {baseLocale, editingId, setEditingId, isEditing, reloadToponymes, voie, toponyme} = useContext(BalDataContext)

  const onEnableEditing = useCallback(e => {
    e.stopPropagation()

    if (voie || initialToponyme !== toponyme) {
      router.push(
        `/bal/toponyme?balId=${baseLocale._id}&codeCommune=${initialToponyme.commune}&idToponyme=${initialToponyme._id}`,
        `/bal/${baseLocale._id}/communes/${initialToponyme.commune}/toponymes/${initialToponyme._id}`
      )
    }

    if (!isEditing && !voie && initialToponyme._id === toponyme?._id) {
      setEditingId(toponyme._id)
    }
  }, [isEditing, setEditingId, voie, baseLocale._id, initialToponyme, router, toponyme])

  const position = initialToponyme.positions.find(position => position.type === 'segment') || initialToponyme.positions[0]

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

  const deleteToponyme = (async () => {
    const {_id} = initialToponyme

    try {
      await removeToponyme(_id, token)
      await reloadToponymes()

      if (_id === toponyme._id) {
        router.push(
          `/bal/&codeCommune=${initialToponyme.commune}`,
          `/bal/${baseLocale._id}/communes/${initialToponyme.commune}`
        )
      }
    } catch (error) {
      setError(error.message)
    }

    setShowContextMenu(false)
  })

  if (!position) {
    return null
  }

  if (markers.length > 0 && editingId === initialToponyme._id) {
    return null
  }

  const {coordinates} = position.point

  return (
    <>
      <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
        <Pane {...markerStyle} onClick={onEnableEditing} onContextMenu={() => setShowContextMenu(initialToponyme._id)}>
          <Text color='white' paddingLeft={8} paddingRight={10}>
            {initialToponyme.nom}
          </Text>
        </Pane>

        {showContextMenu && (
          <Pane background='tint1' position='absolute' margin={10}>
            <Menu>
              <Menu.Group>
                <Menu.Item icon={TrashIcon} intent='danger' onSelect={deleteToponyme}>
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
  initialToponyme: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.shape({
      point: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
      })
    })),
    commune: PropTypes.string
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
