import React, {useMemo, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {useRouter} from 'next/router'
import {Pane, Text, Menu, TrashIcon} from 'evergreen-ui'
import {css} from 'glamor'

import {removeToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import MarkersContext from '@/contexts/markers'
import BalDataContext from '@/contexts/bal-data'

import useError from '@/hooks/error'

function ToponymeMarker({initialToponyme, isLabelDisplayed, isContextMenuDisplayed, setIsContextMenuDisplayed}) {
  const [setError] = useError()
  const router = useRouter()

  const {balId} = router.query

  const {token} = useContext(TokenContext)
  const {markers} = useContext(MarkersContext)
  const {editingId, setEditingId, isEditing, reloadToponymes, voie, toponyme} = useContext(BalDataContext)

  const onEnableEditing = useCallback(e => {
    e.stopPropagation()

    if (!isEditing) {
      if (voie || initialToponyme !== toponyme) {
        router.push(
          `/bal/toponyme?balId=${balId}&idToponyme=${initialToponyme._id}`,
          `/bal/${balId}/toponymes/${initialToponyme._id}`
        )
      }

      if (!voie && initialToponyme._id === toponyme?._id) {
        setEditingId(toponyme._id)
      }
    }
  }, [isEditing, setEditingId, voie, balId, initialToponyme, router, toponyme])

  const position = initialToponyme.positions.find(position => position.type === 'segment') || initialToponyme.positions[0]

  const markerStyle = useMemo(() => css({
    borderRadius: 20,
    marginTop: -10,
    marginLeft: -10,
    color: 'transparent',
    whiteSpace: 'nowrap',
    background: isLabelDisplayed ? 'rgba(0, 0, 0, 0.5)' : null,
    cursor: 'pointer',

    '& > span': {
      display: isLabelDisplayed ? 'inline-block' : 'none'
    }
  }), [isLabelDisplayed])

  const deleteToponyme = async () => {
    const {_id} = initialToponyme

    try {
      await removeToponyme(_id, token)
      await reloadToponymes()

      if (_id === toponyme._id) {
        return router.push(
          `/bal?balId=${balId}`,
          `/bal/${balId}`
        )
      }
    } catch (error) {
      setError(error.message)
    }

    setIsContextMenuDisplayed(null)
  }

  if (!position) {
    return null
  }

  if (markers.length > 0 && editingId === initialToponyme._id) {
    return null
  }

  const {coordinates} = position.point

  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
      <Pane {...markerStyle} onClick={onEnableEditing} onContextMenu={() => setIsContextMenuDisplayed(initialToponyme._id)}>
        <Text color='white' paddingLeft={8} paddingRight={10}>
          {initialToponyme.nom}
        </Text>
      </Pane>

      {isContextMenuDisplayed && (
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
    }))
  }).isRequired,
  isLabelDisplayed: PropTypes.bool,
  isContextMenuDisplayed: PropTypes.bool,
  setIsContextMenuDisplayed: PropTypes.func.isRequired
}

ToponymeMarker.defaultProps = {
  isLabelDisplayed: false,
  isContextMenuDisplayed: false
}

export default React.memo(ToponymeMarker)
