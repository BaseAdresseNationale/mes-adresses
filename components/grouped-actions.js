import React, {useContext, useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Heading, Dialog, Paragraph, SelectField, Checkbox, Alert, EditIcon, TrashIcon} from 'evergreen-ui'
import {sortBy, uniq} from 'lodash'

import {normalizeSort} from '../lib/normalize'
import {positionsTypesList} from '../lib/positions-types-list'
import BalDataContext from '../contexts/bal-data'
import {useInput, useCheckboxInput} from '../hooks/input'

import Comment from './comment'

const GroupedActions = ({idVoie, numeros, selectedNumerosIds, resetSelectedNumerosIds, setIsRemoveWarningShown, onSubmit}) => {
  const {voies} = useContext(BalDataContext)

  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [positionType, onPositionTypeChange] = useInput('')
  const [selectedVoieId, setSelectedVoieId] = useState(idVoie)
  const [error, setError] = useState()
  const [comment, onCommentChange] = useInput('')
  const [removeAllComments, onRemoveAllCommentsChange] = useCheckboxInput(false)

  const selectedNumeros = numeros.filter(({_id}) => selectedNumerosIds.includes(_id))
  const selectedNumerosUniqType = uniq(selectedNumeros.map(numero => (numero.positions[0].type)))

  const handleComplete = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const handleClick = () => {
    setIsShown(true)
  }

  const handleConfirm = useCallback(async () => {
    const data = {selectedVoieId, numeros: selectedNumeros, positionType}
    const body = data.numeros
    const type = data.positionType

    setIsLoading(true)

    const commentCondition = r => {
      if (removeAllComments) {
        return null
      }

      if (comment === '') {
        return r.comment || null
      }

      if (r.comment) {
        return `${r.comment} , ${comment}`
      }

      return comment
    }

    body.map(r => {
      r.voie = selectedVoieId
      r.positions[0].type = type === '' ? r.positions[0].type : type

      r.comment = commentCondition(r)

      return r
    })

    try {
      await onSubmit(body)
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
    setIsShown(false)
    resetSelectedNumerosIds()
  }, [comment, selectedVoieId, onSubmit, positionType, removeAllComments, selectedNumeros, resetSelectedNumerosIds])

  return (
    <Pane padding={16}>
      <Pane marginBottom={5}>
        <Heading>Actions groupées</Heading>
      </Pane>
      <Pane>
        <Dialog
          isShown={isShown}
          intent='success'
          title='Modification multiple'
          isConfirmLoading={isLoading}
          cancelLabel='Annuler'
          confirmLabel={isLoading ? 'Chargement...' : 'Enregistrer'}
          onCloseComplete={() => handleComplete()}
          onConfirm={() => handleConfirm()}
        >

          <Paragraph marginBottom={8} color='muted'>{`${selectedNumerosIds.length} numéros sélectionnés`}</Paragraph>

          <SelectField
            label='Voie'
            flex={1}
            marginBottom={16}
            onChange={event => setSelectedVoieId(event.target.value)}
          >
            {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
              <option
                key={_id}
                selected={_id === selectedVoieId}
                value={_id}
              >
                {nom}
              </option>
            ))}

          </SelectField>
          <SelectField
            flex={1}
            label='Type'
            display='block'
            marginBottom={16}
            onChange={onPositionTypeChange}
          >
            {selectedNumerosUniqType.length !== 1 && (
              <option selected value='' >-- Veuillez choisir un type de position --</option>
            )}
            {positionsTypesList.map(positionType => (
              <option key={positionType.value} selected={selectedNumerosUniqType.toString() === positionType.value} value={positionType.value}>{positionType.name}</option>
            ))}
          </SelectField>

          <Comment input={comment} isDisabled={removeAllComments} onChange={onCommentChange} />

          <Checkbox
            label='Effacer tous les commentaires'
            checked={removeAllComments}
            onChange={onRemoveAllCommentsChange}
          />

        </Dialog>

        {error && (
          <Alert marginBottom={16} intent='danger' title='Erreur'>
            {error}
          </Alert>
        )}
        <Button
          iconBefore={EditIcon}
          appearance='primary'
          intent='infos'
          onClick={() => handleClick()}
        >
          Modifier les numéros
        </Button>
        <Button
          marginLeft={16}
          iconBefore={TrashIcon}
          intent='danger'
          onClick={() => setIsRemoveWarningShown(true)}
        >
          Supprimer les numéros
        </Button>
      </Pane>
    </Pane>
  )
}

GroupedActions.propTypes = {
  idVoie: PropTypes.string.isRequired,
  numeros: PropTypes.array,
  selectedNumerosIds: PropTypes.array.isRequired,
  resetSelectedNumerosIds: PropTypes.func.isRequired,
  setIsRemoveWarningShown: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

GroupedActions.defaultProps = {
  numeros: []
}

export default GroupedActions
