import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, TextInput, Button, Alert, Checkbox} from 'evergreen-ui'
import {useRouter} from 'next/router'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'

import PositionEditor from './position-editor'
import VoieSearch from './voie-search'

function CreateAddress({onSubmit, onCancel, onIsToponymeChange, isToponyme}) {
  const router = useRouter()

  const {baseLocale, voie} = useContext(BalDataContext)
  const {markers, enableMarkers, disableMarkers} = useContext(MarkersContext)

  const [isLoading, setIsLoading] = useState(false)
  const [numero, onNumeroChange] = useInput('')
  const [selectedVoie, setSelectedVoie] = useState(voie)
  const [suffixe, onSuffixeChange] = useInput('')
  const [comment, onCommentChange] = useInput('')
  const [error, setError] = useState()
  const focusRef = useFocus()

  const onSelectVoie = useCallback(selectedVoie => {
    setSelectedVoie(selectedVoie)
  }, [])

  const onFormSubmit = useCallback(async e => {
    const body = {}
    e.preventDefault()

    setIsLoading(true)

    if (isToponyme) {
      body.nom = numero
    } else {
      body.numero = Number(numero)
      body.suffixe = suffixe.length > 0 ? suffixe : null
      body.comment = comment.length > 0 ? comment : null
    }

    if (markers) {
      const positions = []
      markers.forEach(marker => {
        positions.push(
          {
            point: {
              type: 'Point',
              coordinates: [marker.longitude, marker.latitude]
            },
            type: marker.type
          }
        )
      })

      body.positions = positions
    } else {
      body.positions = []
    }

    try {
      await onSubmit(body, selectedVoie ? selectedVoie._id : null)
      disableMarkers()

      if (selectedVoie._id !== voie._id) {
        router.push(
          `/bal/voie?balId=${baseLocale._id}&codeCommune=${selectedVoie.commune}&idVoie=${selectedVoie._id}`,
          `/bal/${baseLocale._id}/communes/${selectedVoie.commune}/voies/${selectedVoie._id}`
        )
      }
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [isToponyme, markers, numero, suffixe, comment, onSubmit, selectedVoie, disableMarkers, voie, router, baseLocale])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarkers()
    onCancel()
  }, [disableMarkers, onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return 'Ajouter'
  }, [isLoading])

  useEffect(() => {
    setSelectedVoie(isToponyme ? null : voie)
  }, [isToponyme, voie])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      disableMarkers()
      onCancel()
    }
  }, [onCancel])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <Heading is='h4'>Nouvelle adresse</Heading>

      <Pane display='flex'>
        <TextInput
          ref={focusRef}
          required
          display='block'
          type={isToponyme ? 'text' : 'number'}
          disabled={isLoading}
          width='100%'
          maxWidth={300}
          min={0}
          max={9999}
          value={numero}
          marginBottom={16}
          placeholder={isToponyme ? 'Nom du toponyme…' : 'Numéro'}
          onChange={onNumeroChange}
        />

        {!isToponyme && (
          <TextInput
            display='block'
            marginLeft={8}
            disabled={isLoading}
            width='100%'
            flex={1}
            minWidth={59}
            value={suffixe}
            maxLength={10}
            marginBottom={16}
            placeholder='Suffixe'
            onChange={onSuffixeChange}
          />
        )}
      </Pane>

      {!isToponyme && (
        <VoieSearch
          defaultVoie={selectedVoie}
          onSelect={onSelectVoie}
        />
      )}

      <Checkbox
        checked={isToponyme}
        label='Cette adresse est un toponyme'
        onChange={onIsToponymeChange}
      />

      {markers && (
        <PositionEditor
          markers={markers}
          enableMarkers={enableMarkers}
        />
      )}

      {!isToponyme && (
        <Comment input={comment} onChange={onCommentChange} />
      )}

      {error && (
        <Alert marginBottom={16} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success' marginTop={16}>
        {submitLabel}
      </Button>

      {onCancel && (
        <Button
          disabled={isLoading}
          appearance='minimal'
          marginLeft={8}
          marginTop={16}
          display='inline-flex'
          onClick={onFormCancel}
        >
          Annuler
        </Button>
      )}
    </Pane>
  )
}

CreateAddress.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isToponyme: PropTypes.bool.isRequired,
  onIsToponymeChange: PropTypes.func.isRequired
}

export default CreateAddress
