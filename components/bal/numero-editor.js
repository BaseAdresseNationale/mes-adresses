import {useState, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {xor, sortBy} from 'lodash'
import {Pane, SelectField, TextInputField} from 'evergreen-ui'

import {addVoie, addNumero, editNumero} from '@/lib/bal-api'

import {normalizeSort} from '@/lib/normalize'
import {computeCompletNumero} from '@/lib/utils/numero'

import TokenContext from '@/contexts/token'
import MarkersContext from '@/contexts/markers'
import BalDataContext from '@/contexts/bal-data'
import ParcellesContext from '@/contexts/parcelles'

import {useInput} from '@/hooks/input'
import useFocus from '@/hooks/focus'
import useValidationMessage from '@/hooks/validation-messages'
import MapContext from '@/contexts/map'

import Comment from '@/components/comment'
import Form from '@/components/form'
import FormInput from '@/components/form-input'
import CertificationButton from '@/components/certification-button'
import PositionEditor from '@/components/bal/position-editor'
import SelectParcelles from '@/components/bal/numero-editor/select-parcelles'
import NumeroVoieSelector from '@/components/bal/numero-editor/numero-voie-selector'
import AddressPreview from '@/components/bal/address-preview'
import DisabledFormInput from '@/components/disabled-form-input'

const REMOVE_TOPONYME_LABEL = 'Aucun toponyme'

function NumeroEditor({initialVoieId, initialValue, commune, hasPreview, closeForm}) {
  const [voieId, setVoieId] = useState(initialVoieId || initialValue?.voie._id)
  const [selectedNomToponyme, setSelectedNomToponyme] = useState('')
  const [toponymeId, setToponymeId] = useState(initialValue?.toponyme)
  const [isLoading, setIsLoading] = useState(false)
  const [certifie, setCertifie] = useState(initialValue?.certifie || false)
  const [numero, onNumeroChange] = useInput(initialValue?.numero.toString())
  const [nomVoie, onNomVoieChange] = useState('')
  const [selectedNomVoie, setSelectedNomVoie] = useState('')
  const [suffixe, onSuffixeChange] = useInput(initialValue?.suffixe)
  const [comment, onCommentChange] = useInput(initialValue?.comment)
  const [getValidationMessage, setValidationMessages] = useValidationMessage(null)

  const {token} = useContext(TokenContext)
  const {baseLocale, voies, toponymes, reloadNumeros, reloadParcelles, refreshBALSync, reloadVoies} = useContext(BalDataContext)
  const {selectedParcelles} = useContext(ParcellesContext)
  const {markers, suggestedNumero, setOverrideText} = useContext(MarkersContext)
  const {reloadTiles} = useContext(MapContext)

  const [ref] = useFocus(true)

  const getEditedVoie = useCallback(async () => {
    if (nomVoie) {
      const {validationMessages, ...newVoie} = await addVoie(baseLocale._id, {nom: nomVoie}, token)
      setValidationMessages(validationMessages)

      return newVoie
    }

    return {_id: voieId}
  }, [baseLocale._id, nomVoie, voieId, token, setValidationMessages])

  const getNumeroBody = useCallback(() => {
    const body = {
      toponyme: toponymeId,
      numero: Number(numero),
      suffixe: suffixe.length > 0 ? suffixe.toLowerCase().trim() : null,
      comment: comment.length > 0 ? comment : null,
      parcelles: selectedParcelles,
      certifie: certifie ?? (initialValue?.certifie || false)
    }

    if (markers.length > 0) {
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

      return {...body, positions}
    }
  }, [initialValue, numero, suffixe, markers, certifie, toponymeId, comment, selectedParcelles])

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const body = getNumeroBody()
      const voie = await getEditedVoie()

      // Add or edit a numero
      const submit = initialValue ?
        async () => editNumero(initialValue._id, {voie: voie._id, ...body}, token) :
        async () => addNumero(voie._id, body, token)
      const {validationMessages} = await submit()
      setValidationMessages(validationMessages)

      await reloadNumeros()
      reloadTiles()
      if (xor(initialValue?.parcelles, body?.parcelles).length > 0) {
        await reloadParcelles()
      }

      if (initialVoieId !== voie._id) {
        reloadVoies()
      }

      setIsLoading(false)
      refreshBALSync()
      closeForm()
    } catch {
      setIsLoading(false)
    }
  }, [token, getNumeroBody, getEditedVoie, closeForm, reloadNumeros, refreshBALSync, reloadParcelles, initialValue, setValidationMessages, reloadVoies, initialVoieId, reloadTiles])

  useEffect(() => {
    setOverrideText(numero ? computeCompletNumero(numero, suffixe) : null)
  }, [setOverrideText, numero, suffixe])

  useEffect(() => {
    let nom = null
    if (voieId) {
      nom = voies.find(voie => voie._id === voieId).nom
    }

    setSelectedNomVoie(nom)
  }, [voieId, voies])

  useEffect(() => {
    let nom = null
    if (toponymeId) {
      nom = toponymes.find(toponyme => toponyme._id === toponymeId).nom
    }

    setSelectedNomToponyme(nom)
  }, [toponymeId, toponymes])

  return (
    <Form editingId={initialValue?._id} closeForm={closeForm} onFormSubmit={onFormSubmit}>
      {hasPreview && (
        <AddressPreview
          numero={numero}
          suffixe={suffixe}
          selectedNomToponyme={selectedNomToponyme}
          voie={nomVoie || selectedNomVoie}
          commune={commune}
        />
      )}

      <Pane paddingTop={hasPreview ? 36 : 0}>
        <FormInput>
          <NumeroVoieSelector
            voieId={voieId}
            voies={voies}
            nomVoie={nomVoie}
            initialNomAlt={initialValue?.nomAlt}
            mode={voieId ? 'selection' : 'creation'}
            validationMessage={getValidationMessage('nom')}
            handleVoie={setVoieId}
            handleNomVoie={onNomVoieChange}
          />
        </FormInput>

        <Pane display='flex'>
          <FormInput>
            <SelectField
              label='Toponyme'
              flex={1}
              marginBottom={0}
              value={toponymeId || ''}
              onChange={({target}) => {
                setToponymeId((target.value === REMOVE_TOPONYME_LABEL || target.value === '- Choisir un toponyme -') ? null : target.value)
              }}
            >
              <option value={null}>{initialValue?.toponyme ? REMOVE_TOPONYME_LABEL : '- Choisir un toponyme -'}</option>
              {sortBy(toponymes, t => normalizeSort(t.nom)).map(({_id, nom}) => (
                <option key={_id} value={_id}>
                  {nom}
                </option>
              ))}
            </SelectField>
          </FormInput>
        </Pane>

        <FormInput>
          <Pane display='flex' alignItems='flex-start'>
            <TextInputField
              ref={ref}
              required
              label='Numéro'
              display='block'
              type='number'
              disabled={isLoading}
              width='100%'
              maxWidth={300}
              flex={2}
              min={0}
              max={9999}
              value={numero}
              marginBottom={0}
              onWheel={e => e.target.blur()}
              placeholder={`Numéro${suggestedNumero ? ` recommandé : ${suggestedNumero}` : ''}`}
              onChange={onNumeroChange}
              validationMessage={getValidationMessage('numero')}
            />

            <TextInputField
              label=''
              style={{textTransform: 'lowercase'}}
              display='block'
              marginTop={18}
              marginLeft={8}
              disabled={isLoading}
              width='100%'
              flex={1}
              minWidth={59}
              value={suffixe}
              marginBottom={0}
              placeholder='Suffixe'
              onChange={onSuffixeChange}
              validationMessage={getValidationMessage('suffixe')}
            />
          </Pane>
        </FormInput>

        <FormInput>
          <PositionEditor
            initialPositions={initialValue?.positions}
            validationMessage={getValidationMessage('positions')}
          />
        </FormInput>

        {commune.hasCadastre ? (
          <FormInput>
            <SelectParcelles initialParcelles={initialValue?.parcelles} />
          </FormInput>
        ) : (
          <DisabledFormInput label='Parcelles' />
        )}

        <Comment input={comment} onChange={onCommentChange} />

        <CertificationButton
          isCertified={initialValue?.certifie || false}
          isLoading={isLoading}
          onConfirm={setCertifie}
          onCancel={closeForm}
        />
      </Pane>
    </Form>
  )
}

NumeroEditor.propTypes = {
  initialVoieId: PropTypes.string,
  initialValue: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    numero: PropTypes.number.isRequired,
    voie: PropTypes.oneOfType([
      PropTypes.object, // When "voie" comes from getNumerosToponyme() -> it's an Object with "nomVoie", needed to sort numeros by voie and display nomVoie
      PropTypes.string // When "voie" comes from getNumeros() -> it's a String (only the id of "voie" is return)
    ]).isRequired,
    nomAlt: PropTypes.object,
    suffixe: PropTypes.string,
    parcelles: PropTypes.array,
    comment: PropTypes.string,
    positions: PropTypes.array,
    toponyme: PropTypes.string,
    certifie: PropTypes.bool // eslint-disable-line react/boolean-prop-naming
  }),
  commune: PropTypes.shape({
    hasCadastre: PropTypes.bool.isRequired
  }).isRequired,
  hasPreview: PropTypes.bool,
  closeForm: PropTypes.func
}

NumeroEditor.defaultProps = {
  initialValue: null,
  initialVoieId: null,
  hasPreview: false,
  closeForm: null
}

export default NumeroEditor
