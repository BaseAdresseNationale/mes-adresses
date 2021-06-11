import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {trimStart, trimEnd, sortBy} from 'lodash'
import {Pane, Heading, TextInput, Button, Alert, Checkbox, Select} from 'evergreen-ui'

import {normalizeSort} from '../../lib/normalize'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'
import ParcellesContext from '../../contexts/parcelles'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'

import PositionEditor from './position-editor'
import VoieSearch from './voie-search'
import SelectParcelles from './numero-editor/select-parcelles'

function AddressEditor({onSubmit, onCancel, isToponyme, setIsToponyme}) {
  const {voie, toponymes, setIsEditing} = useContext(BalDataContext)
  const {markers, addMarker, disableMarkers, suggestedNumero, setOverrideText} = useContext(MarkersContext)
  const {selectedParcelles, setIsParcelleSelectionEnabled} = useContext(ParcellesContext)

  const [isLoading, setIsLoading] = useState(false)
  const [input, onInputChange] = useInput('')
  const [selectedVoie, setSelectedVoie] = useState(voie)
  const [nomVoie, setNomVoie] = useState(voie ? voie.nom : '')
  const [toponyme, setToponyme] = useState()
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
    setIsLoading(true)

    const positions = markers.map(marker => {
      return {
        point: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude]
        },
        type: marker.type
      }
    })

    let voie
    let numero = null
    let editedToponyme

    if (isToponyme) {
      editedToponyme = {nom: input, positions}
    } else {
      voie = selectedVoie || {
        nom: nomVoie
      }
      numero = {
        numero: Number(input),
        toponyme: toponyme?._id,
        suffixe: suffixe.length > 0 ? suffixe : null,
        comment: comment.length > 0 ? comment : null,
        parcelles: selectedParcelles,
        positions
      }
    }

    try {
      await onSubmit((isToponyme ? editedToponyme : voie), numero)
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }, [input, nomVoie, comment, suffixe, markers, selectedParcelles, isToponyme, selectedVoie, onSubmit, toponyme])

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

  const handleToponymeChange = e => {
    const {value} = e.target

    setToponyme(toponymes.find(({_id}) => _id === value))
  }

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
      setIsToponyme(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOverrideText(input)
  }, [setOverrideText, input])

  useEffect(() => {
    setIsEditing(true)
    setIsParcelleSelectionEnabled(true)
    return () => {
      disableMarkers()
      setIsEditing(false)
      setIsParcelleSelectionEnabled(false)
    }
  }, [setIsEditing, disableMarkers, setIsParcelleSelectionEnabled])

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
          placeholder={isToponyme ? 'Nom du toponyme…' : suggestedNumero ? `Numéro recommandé : ${suggestedNumero}` : 'Numéro'}
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
        <Pane display='grid' gridTemplateColumns='1fr 3fr'>
          <VoieSearch
            selectedVoie={selectedVoie}
            nomVoie={nomVoie}
            setNomVoie={e => setNomVoie(trimStart(trimEnd(e.target.value)))}
            onSelect={onSelectVoie}
          />
          <Select
            marginLeft='1em'
            onChange={handleToponymeChange}
          >
            <option value={null}>- Choisir un toponyme -</option>
            {sortBy(toponymes, t => normalizeSort(t.nom)).map(({_id, nom}) => (
              <option
                key={_id}
                value={_id}
              >
                {nom}
              </option>
            ))}
          </Select>
        </Pane>
      )}

      <Checkbox
        checked={isToponyme}
        label='Cette adresse est un toponyme'
        onChange={e => setIsToponyme(e.target.checked)}
      />

      <PositionEditor />

      <SelectParcelles />

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

AddressEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isToponyme: PropTypes.bool.isRequired,
  setIsToponyme: PropTypes.func.isRequired
}

export default AddressEditor
