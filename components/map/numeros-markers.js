import {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'

import {softRemoveNumero} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'
import MapContext from '@/contexts/map'

import useError from '@/hooks/error'

import NumeroMarker from '@/components/map/numero-marker'

function NumerosMarkers({numeros, isLabelDisplayed, isContextMenuDisplayed, setIsContextMenuDisplayed, color}) {
  const [setError] = useError()

  const {token} = useContext(TokenContext)
  const {setEditingId, isEditing, reloadNumeros, reloadParcelles, refreshBALSync} = useContext(BalDataContext)
  const {reloadTiles} = useContext(MapContext)

  const onEnableEditing = useCallback((event, numeroId) => {
    const {rightButton} = event

    if (!isEditing) {
      if (rightButton) {
        setIsContextMenuDisplayed(numeroId)
      } else {
        setEditingId(numeroId)
      }
    }
  }, [setEditingId, setIsContextMenuDisplayed, isEditing])

  const markerStyle = useCallback(color => css({
    borderRadius: 20,
    marginTop: -10,
    marginLeft: -10,
    color: 'transparent',
    whiteSpace: 'nowrap',
    background: isLabelDisplayed ? 'rgba(0, 0, 0, 0.7)' : null,
    cursor: 'pointer',

    '&:before': {
      content: ' ',
      backgroundColor: color,
      border: '1px solid white',
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      marginLeft: 6
    },

    '& > span, & > svg': {
      display: isLabelDisplayed ? 'inline-block' : 'none'
    },

    '&:hover': isLabelDisplayed ? null : {
      background: 'rgba(0, 0, 0, 0.7)',

      '& > span, & > svg': {
        display: 'inline-block'
      }
    }
  }), [isLabelDisplayed])

  const removeAddress = useCallback(async numeroId => {
    try {
      await softRemoveNumero(numeroId, token)
      await reloadNumeros()
      await reloadParcelles()
      reloadTiles()
      refreshBALSync()
    } catch (error) {
      setError(error.message)
    }

    setIsContextMenuDisplayed(null)
  }, [token, reloadNumeros, reloadParcelles, setError, setIsContextMenuDisplayed, refreshBALSync, reloadTiles])

  return (
    numeros.map(numero => (
      <NumeroMarker
        key={numero._id}
        numero={numero}
        style={markerStyle(color)}
        isContextMenuDisplayed={numero._id === isContextMenuDisplayed}
        removeAddress={removeAddress}
        onEnableEditing={onEnableEditing}
      />
    ))
  )
}

NumerosMarkers.propTypes = {
  numeros: PropTypes.array.isRequired,
  isLabelDisplayed: PropTypes.bool.isRequired,
  isContextMenuDisplayed: PropTypes.string,
  setIsContextMenuDisplayed: PropTypes.func.isRequired,
  color: PropTypes.string
}

export default NumerosMarkers
