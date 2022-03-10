import {useContext, useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Heading, Dialog, Paragraph, SelectField, Checkbox, Alert, EditIcon, TrashIcon} from 'evergreen-ui'
import {sortBy, uniq} from 'lodash'

import {normalizeSort} from '../lib/normalize'
import {positionsTypesList} from '../lib/positions-types-list'
import BalDataContext from '../contexts/bal-data'
import {useInput, useCheckboxInput} from '../hooks/input'

import Comment from './comment'
import CertificationButton from './certification-button'
import Form from './form'
import FormInput from './form-input'

function GroupedActions({idVoie, numeros, selectedNumerosIds, resetSelectedNumerosIds, setIsRemoveWarningShown, isAllSelectedCertifie, onSubmit}) {
  const {voies, toponymes, baseLocale} = useContext(BalDataContext)

  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVoieId, setSelectedVoieId] = useState(idVoie)
  const [error, setError] = useState()
  const [comment, onCommentChange] = useInput('')
  const [removeAllComments, onRemoveAllCommentsChange] = useCheckboxInput(false)
  const [certifie, setCertifie] = useState(null)

  const selectedNumeros = numeros.filter(({_id}) => selectedNumerosIds.includes(_id))

  const selectedNumerosUniqType = uniq(selectedNumeros.map(numero => (numero.positions[0].type)))
  const hasMultiposition = selectedNumeros.find(numero => numero.positions.length > 1)
  const hasComment = selectedNumeros.some(numero => numero.comment)

  const selectedNumerosUniqVoie = uniq(selectedNumeros.map(numero => numero.voie))

  // Returns a unique position type, if selected numeros have only one and the same position type
  const getDefaultPositionType = useCallback(() => {
    if (!hasMultiposition && selectedNumerosUniqType.length === 1) {
      return selectedNumerosUniqType[0]
    }

    return ''
  }, [hasMultiposition, selectedNumerosUniqType])

  const [positionType, onPositionTypeChange, resetPositionType] = useInput(getDefaultPositionType)
  const selectedNumerosUniqToponyme = uniq(selectedNumeros.map(numero => numero.toponyme))
  const hasUniqToponyme = selectedNumerosUniqToponyme.length === 1

  const getDefaultToponyme = useCallback(() => {
    if (hasUniqToponyme) {
      return selectedNumerosUniqToponyme[0]
    }

    return null
  }, [hasUniqToponyme, selectedNumerosUniqToponyme])

  const [selectedToponymeId, setSelectedToponymeId] = useState(getDefaultToponyme)

  const handleClick = () => {
    setIsShown(true)
    resetPositionType()
  }

  const onFormCancel = () => {
    resetSelectedNumerosIds()
    setIsShown(false)
  }

  const handleConfirm = useCallback(async event => {
    event.preventDefault()

    const commentCondition = c => {
      if (removeAllComments) {
        return null
      }

      if (c) {
        return c
      }
    }

    const getCertifie = c => {
      if (c !== null) {
        return c
      }
    }

    setIsLoading(true)

    try {
      await onSubmit(baseLocale._id, {
        numerosIds: selectedNumerosIds,
        changes: {
          voie: selectedVoieId,
          [positionType === '' ? null : 'positionType']: positionType,
          toponyme: selectedToponymeId === '' ? null : selectedToponymeId,
          comment: commentCondition(comment),
          certifie: getCertifie(certifie)
        }
      })
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
    setIsShown(false)
    resetSelectedNumerosIds()
  }, [comment, selectedVoieId, certifie, selectedToponymeId, onSubmit, positionType, removeAllComments, resetSelectedNumerosIds, baseLocale, selectedNumerosIds])

  useEffect(() => {
    if (!isShown) {
      setSelectedToponymeId(getDefaultToponyme)
    }
  }, [isShown, getDefaultToponyme])

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
          hasFooter={false}
          onCloseComplete={() => onFormCancel()}
        >
          <Pane marginX='-32px' marginBottom='-8px'>
            <Paragraph marginBottom={8} marginLeft={32} color='muted'>{`${selectedNumerosIds.length} numéros sélectionnés`}</Paragraph>
            <Form onFormSubmit={handleConfirm}>
              <FormInput>
                <SelectField
                  value={selectedVoieId}
                  label='Voie'
                  margin={0}
                  flex={1}
                  disabled={selectedNumerosUniqVoie.length > 1}
                  onChange={event => setSelectedVoieId(event.target.value)}
                >
                  {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
                    <option key={_id} value={_id}>
                      {nom}
                    </option>
                  ))}
                </SelectField>
              </FormInput>

              {selectedNumerosUniqVoie.length > 1 && (
                <Alert intent='none' marginBottom={8}>Les numéros sélectionnés ne sont pas situés sur la même voie. La modification groupée de la voie n’est pas possible. Ils doivent être modifiés séparément.</Alert>
              )}

              <Pane display='flex'>
                <FormInput>
                  <SelectField
                    value={selectedToponymeId || ''}
                    label='Toponyme'
                    margin={0}
                    flex={1}
                    disabled={selectedNumerosUniqToponyme.length > 1}
                    onChange={event => setSelectedToponymeId(event.target.value)}
                  >
                    <option value=''>{selectedToponymeId || selectedToponymeId === '' ? 'Ne pas associer de toponyme' : '- Choisir un toponyme -'}</option>
                    {sortBy(toponymes, t => normalizeSort(t.nom)).map(({_id, nom}) => (
                      <option key={_id} value={_id}>
                        {nom}
                      </option>
                    ))}
                  </SelectField>
                </FormInput>
              </Pane>

              {selectedNumerosUniqToponyme.length > 1 && (
                <Alert intent='none' marginBottom={8}>Les numéros sélectionnés ne possèdent pas le même toponyme. La modification groupée du toponyme n’est pas possible. Ils doivent être modifiés séparément.</Alert>
              )}

              <FormInput>
                <SelectField
                  value={positionType}
                  disabled={hasMultiposition}
                  flex={1}
                  label='Type de position'
                  margin={0}
                  display='block'
                  onChange={onPositionTypeChange}
                >
                  {(selectedNumerosUniqType.length !== 1 || hasMultiposition) && (
                    <option value='' >-- Veuillez choisir un type de position --</option>
                  )}
                  {positionsTypesList.map(positionType => (
                    <option key={positionType.value} value={positionType.value}>{positionType.name}</option>
                  ))}
                </SelectField>
              </FormInput>

              {hasMultiposition && (
                <Alert intent='none' marginBottom={8}>Certains numéros sélectionnés possèdent plusieurs positions. La modification groupée du type de position n’est pas possible. Ils doivent être modifiés séparément.</Alert>
              )}

              <Comment input={comment} isDisabled={removeAllComments} onChange={onCommentChange} />

              {hasComment && (
                <Alert intent='warning' marginBottom={8}>Attention, certains numéros sélectionnés possèdent un commentaire. En cas de modification, il sera remplacé.</Alert>
              )}

              <Checkbox
                label='Effacer tous les commentaires'
                checked={removeAllComments}
                onChange={onRemoveAllCommentsChange}
              />

              <Pane display='flex' justifyContent='end' paddingBottom={16}>
                <CertificationButton
                  isLoading={isLoading}
                  isCertified={isAllSelectedCertifie}
                  onConfirm={setCertifie}
                  onCancel={onFormCancel}
                />
              </Pane>
            </Form>
          </Pane>
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
  isAllSelectedCertifie: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default GroupedActions
