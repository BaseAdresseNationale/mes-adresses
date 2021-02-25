import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {trimStart, trimEnd} from 'lodash'
import {Pane, Heading, TextInput, Button, Alert, Checkbox} from 'evergreen-ui'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'

import PositionEditor from './position-editor'
import VoieSearch from './voie-search'

function CreateAddress({onSubmit, onCancel, onIsToponymeChange, isToponyme}) {
  const {voie} = useContext(BalDataContext)
  const {markers, addMarker, disableMarkers} = useContext(MarkersContext)

  const [isLoading, setIsLoading] = useState(false)
  const [input, onInputChange] = useInput('')
  const [selectedVoie, setSelectedVoie] = useState(voie)
  const [nomVoie, setNomVoie] = useState(voie ? voie.nom : '')
  const [suffixe, onSuffixeChange] = useInput('')
  const [comment, onCommentChange] = useInput('')
  const [error, setError] = useState()
  const focusRef = useFocus()

  const onSelectVoie = selectedVoie => {
    setSelectedVoie(selectedVoie)
    setNomVoie(selectedVoie.nom)
  }

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()
    const positions = markers.map(marker => {
      return {
        point: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude]
        },
        type: marker.type
      }
    })

    setIsLoading(true)

    let voie
    let numero = null
    if (isToponyme) {
      voie = {nom: input, positions}
    } else {
      voie = selectedVoie || {
        nom: nomVoie
      }
      numero = {
        numero: Number(input),
        suffixe: suffixe.length > 0 ? suffixe : null,
        comment: comment.length > 0 ? comment : null,
        positions
      }
    }

    try {
      await onSubmit(voie, numero)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [input, nomVoie, comment, suffixe, markers, isToponyme, selectedVoie, onSubmit])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarkers()
    onCancel()
  }, [disableMarkers, onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return 'Enregistrer'
  }, [isLoading])

  useEffect(() => {
    setSelectedVoie(isToponyme ? null : voie)
  }, [isToponyme, voie])

  useEffect(() => {
    if (selectedVoie && selectedVoie.nom !== nomVoie) {
      setSelectedVoie(null)
    }
  }, [nomVoie, selectedVoie])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      disableMarkers()
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    addMarker({type: isToponyme ? 'segment' : 'entrée'})

    return () => {
      disableMarkers()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          value={input}
          marginBottom={16}
          placeholder={isToponyme ? 'Nom du toponyme…' : 'Numéro'}
          onChange={onInputChange}
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
          selectedVoie={selectedVoie}
          nomVoie={nomVoie}
          setNomVoie={e => setNomVoie(trimStart(trimEnd(e.target.value)))}
          onSelect={onSelectVoie}
        />
      )}

      <Checkbox
        checked={isToponyme}
        label='Cette adresse est un toponyme'
        onChange={onIsToponymeChange}
      />

      {markers.length > 0 && (
        <PositionEditor isToponyme={isToponyme} />
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
