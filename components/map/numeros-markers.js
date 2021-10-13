import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'
import randomColor from 'randomcolor'

import useError from '../../hooks/error'

import {removeNumero} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import NumeroMarker from './numero-marker'

function NumerosMarkers({numeros, voie, isToponymeNumero, showLabel, showContextMenu, setShowContextMenu}) {
  const [setError] = useError()

  const {token} = useContext(TokenContext)
  const {setEditingId, isEditing, reloadNumeros} = useContext(BalDataContext)

  const onEnableEditing = useCallback((e, numeroId) => {
    e.stopPropagation()

    if (!isEditing) {
      setEditingId(numeroId)
    }
  }, [setEditingId, isEditing])

  const markerStyle = useCallback(colorSeed => css({
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
  }), [showLabel])

  const removeAddress = useCallback(async numeroId => {
    try {
      await removeNumero(numeroId, token)
      await reloadNumeros()
    } catch (error) {
      setError(error.message)
    }

    setShowContextMenu(false)
  }, [token, reloadNumeros, setError, setShowContextMenu])

  return (
    numeros.map(numero => (
      <NumeroMarker
        key={numero._id}
        numero={isToponymeNumero ? {...numero, numeroComplet: `${numero.numero}${numero.suffixe || ''}`} : numero}
        style={markerStyle(numero.voie?._id || voie._id)}
        showContextMenu={numero._id === showContextMenu}
        setShowContextMenu={setShowContextMenu}
        removeAddress={removeAddress}
        onEnableEditing={onEnableEditing}
      />
    ))
  )
}

NumerosMarkers.propTypes = {
  numeros: PropTypes.array.isRequired,
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }),
  isToponymeNumero: PropTypes.bool.isRequired,
  showLabel: PropTypes.bool.isRequired,
  showContextMenu: PropTypes.string,
  setShowContextMenu: PropTypes.func.isRequired
}

export default NumerosMarkers

