import React, {useContext, useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Heading, Dialog, Paragraph, SelectField, Checkbox, Alert, EditIcon, TrashIcon} from 'evergreen-ui'
import {sortBy, uniq} from 'lodash'

import {normalizeSort} from '../lib/normalize'
import {positionsTypesList} from '../lib/positions-types-list'
import BalDataContext from '../contexts/bal-data'
import {useInput, useCheckboxInput} from '../hooks/input'

import Comment from './comment'

// Returns a unique position type, if selected numeros have only one and the same position type
const getDefaultPositionType = (hasMultiposition, selectedNumerosUniqType) => {
  if (!hasMultiposition && selectedNumerosUniqType.length === 1) {
    return selectedNumerosUniqType[0]
  }

  return ''
}

const GroupedActions = ({idVoie, numeros, selectedNumerosIds, resetSelectedNumerosIds, setIsRemoveWarningShown, onSubmit}) => {
  const {voies, toponymes} = useContext(BalDataContext)

  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVoieId, setSelectedVoieId] = useState(idVoie)
  const [error, setError] = useState()
  const [comment, onCommentChange] = useInput('')
  const [removeAllComments, onRemoveAllCommentsChange] = useCheckboxInput(false)

  const selectedNumeros = numeros.filter(({_id}) => selectedNumerosIds.includes(_id))

  const selectedNumerosUniqType = uniq(selectedNumeros.map(numero => (numero.positions[0].type)))
  const hasMultiposition = selectedNumeros.find(numero => numero.positions.length > 1)

  const selectedNumerosUniqVoie = uniq(selectedNumeros.map(numero => numero.voie))

  const [positionType, onPositionTypeChange, resetPositionType] = useInput(getDefaultPositionType(hasMultiposition, selectedNumerosUniqType))
  const selectedNumerosUniqToponyme = uniq(selectedNumeros.map(numero => numero.toponyme))
  const hasUniqToponyme = selectedNumerosUniqToponyme.length === 1
  const [selectedToponymeId, setSelectedToponymeId] = useState()

  const handleComplete = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const handleClick = () => {
    setIsShown(true)
    resetPositionType()
  }

  const handleConfirm = useCallback(async () => {
    const data = {selectedVoieId, selectedToponymeId, numeros: selectedNumeros, positionType}
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
      r.toponyme = selectedToponymeId === '' ? null : selectedToponymeId || r.toponyme
      r.positions.forEach(position => {
        if (type) {
          position.type = type
        }
      })

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
  }, [comment, selectedVoieId, selectedToponymeId, onSubmit, positionType, removeAllComments, selectedNumeros, resetSelectedNumerosIds])

  useEffect(() => {
    if (!isShown && hasUniqToponyme) {
      setSelectedToponymeId(selectedNumerosUniqToponyme[0])
    }

    if (!isShown && !hasUniqToponyme) {
      setSelectedToponymeId(null)
    }
  }, [hasUniqToponyme, isShown, selectedNumerosUniqToponyme])

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
            value={selectedVoieId}
            label='Voie'
            flex={1}
            disabled={selectedNumerosUniqVoie.length > 1}
            marginBottom={16}
            onChange={event => setSelectedVoieId(event.target.value)}
          >
            {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
              <option key={_id} value={_id}>
                {nom}
              </option>
            ))}

          </SelectField>

          {selectedNumerosUniqVoie.length > 1 && (
            <Alert intent='none' marginBottom={12}>Les numéros sélectionnés ne sont pas situés sur la même voie. La modification groupée de la voie n’est pas possible. Ils doivent être modifiés séparément.</Alert>
          )}

          <Pane display='flex'>
            <SelectField
              value={selectedToponymeId || ''}
              label='Toponyme'
              flex={1}
              disabled={selectedNumerosUniqToponyme.length > 1}
              marginBottom={16}
              onChange={event => setSelectedToponymeId(event.target.value)}
            >
              <option value=''>{selectedToponymeId || hasUniqToponyme ? 'Ne pas associer de toponyme' : '- Choisir un toponyme -'}</option>
              {sortBy(toponymes, t => normalizeSort(t.nom)).map(({_id, nom}) => (
                <option key={_id} value={_id}>
                  {nom}
                </option>
              ))}
            </SelectField>
          </Pane>

          {selectedNumerosUniqToponyme.length > 1 && (
            <Alert intent='none' marginBottom={12}>Les numéros sélectionnés ne possèdent pas le même toponyme. La modification groupée du toponyme n’est pas possible. Ils doivent être modifiés séparément.</Alert>
          )}

          <SelectField
            value={positionType}
            disabled={hasMultiposition}
            flex={1}
            label='Type de position'
            display='block'
            marginBottom={16}
            onChange={onPositionTypeChange}
          >
            {(selectedNumerosUniqType.length !== 1 || hasMultiposition) && (
              <option value='' >-- Veuillez choisir un type de position --</option>
            )}
            {positionsTypesList.map(positionType => (
              <option key={positionType.value} value={positionType.value}>{positionType.name}</option>
            ))}
          </SelectField>

          {hasMultiposition && (
            <Alert intent='none' marginBottom={12}>Certains numéros sélectionnés possèdent plusieurs positions. La modification groupée du type de position n’est pas possible. Ils doivent être modifiés séparément.</Alert>
          )}

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
  numeros: PropTypes.array.isRequired,
  selectedNumerosIds: PropTypes.array.isRequired,
  resetSelectedNumerosIds: PropTypes.func.isRequired,
  setIsRemoveWarningShown: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default GroupedActions
