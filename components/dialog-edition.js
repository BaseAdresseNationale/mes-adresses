import React, {useState, useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Dialog, SelectField, Button, Paragraph, Alert, Checkbox} from 'evergreen-ui'
import {sortBy} from 'lodash'
import {useInput, useCheckboxInput} from '../hooks/input'
import BalDataContext from '../contexts/bal-data'
import {normalizeSort} from '../lib/normalize'
import Comment from './comment'

const DialogEdition = ({_id, selectedNumerosIds, setSelectedNumerosIds, onSubmit}) => {
  const {voies, numeros} = useContext(BalDataContext)

  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [positionType, onPositionTypeChange] = useInput('entrée')
  const [idVoie, setIdVoie] = useState(_id)
  const [error, setError] = useState()
  const [comment, onCommentChange] = useInput('')
  const [removeAllComments, onRemoveAllCommentsChange] = useCheckboxInput(false)

  const handleComplete = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const handleClick = () => {
    setIsShown(true)
  }

  const handleConfirm = () => {
    const selectedNumeros = numeros.filter(voies => selectedNumerosIds.includes(voies._id))
    const data = {idVoie, numeros: selectedNumeros, positionType}
    multipleEdit(data)
    setIsShown(false)
  }

  const multipleEdit = useCallback(async data => {
    setIsLoading(true)

    const body = data.numeros
    const type = data.positionType

    body.map(r => {
      r.voie = idVoie
      r.positions[0].type = type
      r.comment = removeAllComments ? null : (comment === '' ? (r.comment || null) : (r.comment ? `${r.comment}, ${comment}` : comment))
      return r
    })

    try {
      await onSubmit(body)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }

    setSelectedNumerosIds([])
  }, [removeAllComments, comment, setSelectedNumerosIds, idVoie, onSubmit])

  return (
    <>
      <Dialog
        isShown={isShown}
        title='Modification multiple'
        isConfirmLoading={isLoading}
        cancelLabel='Annuler'
        confirmLabel={isLoading ? 'Chargement...' : 'Enregistrer'}
        onCloseComplete={() => handleComplete()}
        onConfirm={() => handleConfirm()}
      >
        <SelectField
          label='Voie'
          flex={1}
          marginBottom={16}
          onChange={event => setIdVoie(event.target.value)}
        >
          {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
            <option
              key={_id}
              selected={_id === idVoie}
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
          value={positionType}
          onChange={onPositionTypeChange}
        >
          <option value='entrée'>Entrée</option>
          <option value='délivrance postale'>Délivrance postale</option>
          <option value='bâtiment'>Bâtiment</option>
          <option value='cage d’escalier'>Cage d’escalier</option>
          <option value='logement'>Logement</option>
          <option value='parcelle'>Parcelle</option>
          <option value='segment'>Segment</option>
          <option value='service technique'>Service technique</option>
          <option value='inconnue'>Inconnue</option>
        </SelectField>

        <Comment input={comment} isDisabled={removeAllComments} onChange={onCommentChange} />

        <Checkbox
          label='Effacer tous les commentaires'
          checked={removeAllComments}
          onChange={onRemoveAllCommentsChange}
        />

        <Paragraph marginY={8} color='muted'>{`${selectedNumerosIds.length} numéros sélectionnés`}</Paragraph>

      </Dialog>

      {error && (
        <Alert marginBottom={16} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}
      <Button
        iconBefore='edit'
        appearance='primary'
        intent='success'
        onClick={() => handleClick()}
      >
        Modifier les numéros
      </Button>
    </>
  )
}

DialogEdition.propTypes = {
  _id: PropTypes.string.isRequired,
  selectedNumerosIds: PropTypes.array.isRequired,
  setSelectedNumerosIds: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default DialogEdition
