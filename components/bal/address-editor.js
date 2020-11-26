import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, TextInput, Button, Alert, Checkbox} from 'evergreen-ui'
import {useRouter} from 'next/router'

import MarkerContext from '../../contexts/marker'
import BalDataContext from '../../contexts/bal-data'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'

import PositionEditor from './position-editor'
import VoieSearch from './voie-search'

function CreateAddress({onSubmit, onCancel}) {
  const router = useRouter()

  const {baseLocale, voie} = useContext(BalDataContext)
  const {marker, disableMarker} = useContext(MarkerContext)

  const [isLoading, setIsLoading] = useState(false)
  const [isToponyme, onIsToponymeChange] = useCheckboxInput(false)
  const [numero, onNumeroChange] = useInput('')
  const [selectedVoie, setSelectedVoie] = useState(voie)
  const [suffixe, onSuffixeChange] = useInput('')
  const [comment, onCommentChange] = useInput('')
  const [type, onTypeChange] = useInput('entrée')
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

    body.positions = [
      {
        point: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude]
        },
        type
      }
    ]

    try {
      await onSubmit(body, selectedVoie ? selectedVoie._id : null)
      disableMarker()

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
  }, [isToponyme, marker, type, numero, suffixe, comment, onSubmit, selectedVoie, disableMarker, voie, router, baseLocale])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarker()
    onCancel()
  }, [disableMarker, onCancel])

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
      disableMarker()
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

      {marker && (
        <PositionEditor
          marker={marker}
          type={type}
          onTypeChange={onTypeChange}
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
  onCancel: PropTypes.func.isRequired
}

export default CreateAddress
