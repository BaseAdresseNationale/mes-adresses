import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Button, Pane, Text, PlusIcon, PropertyIcon, SelectField, AddIcon} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import AssistedTextField from '@/components/assisted-text-field'
import LanguageField from '../language-field'

function NumeroVoieSelector({voieId, voies, nomVoie, mode, validationMessage, handleVoie, handleNomVoie, selectedLanguages, onAddLanguage, onLanguageSelect, onLanguageChange, onRemoveLanguage}) {
  const [isCreateMode, setIsCreateMode] = useState(mode === 'creation' || !voieId)

  const toggleMode = () => {
    setIsCreateMode(mode => !mode)
  }

  const handleNomVoieChange = e => {
    handleNomVoie(e.target.value)
  }

  const handleVoieChange = e => {
    const idVoie = e.target.value
    handleVoie(idVoie ?? null)
  }

  useEffect(() => {
    if (!isCreateMode) {
      handleNomVoie('')
    }
  }, [isCreateMode, handleNomVoie])

  return (
    <Pane display='flex' flex={1} alignItems='flex-end'>
      <Pane>
        {isCreateMode ? (
          <>
            <AssistedTextField
              isFocus
              label='Nouvelle voie'
              placeholder='Nom de la voie'
              value={nomVoie}
              validationMessage={validationMessage}
              onChange={handleNomVoieChange}
            />
            {mode === 'selection' && (
              <>
                {selectedLanguages.map((field, index) => {
                  return (
                    <LanguageField
                      key={field.id}
                      index={index}
                      field={field}
                      selectedLanguages={selectedLanguages}
                      onChange={onLanguageChange}
                      onSelect={onLanguageSelect}
                      onDelete={onRemoveLanguage}
                    />
                  )
                })}
                <Button
                  type='button'
                  appearance='primary'
                  intent='success'
                  iconBefore={AddIcon}
                  width='100%'
                  onClick={onAddLanguage}
                  marginTop='1em'
                >
                  Ajouter une langue régionale
                </Button>
              </>
            )}
          </>
        ) : (
          <SelectField
            required
            label='Voie'
            flex={1}
            value={voieId}
            margin={0}
            onChange={handleVoieChange}
          >
            {!voieId && (
              <option value=''>- Choisir une voie-</option>
            )}
            {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
              <option key={_id} value={_id}>
                {nom}
              </option>
            ))}
          </SelectField>
        )}
      </Pane>

      <Text marginX={16}>OU</Text>

      <Button
        type='button'
        iconBefore={isCreateMode ? PropertyIcon : PlusIcon}
        onClick={toggleMode}
      >
        {isCreateMode ? 'Choisir' : 'Créer'} une voie
      </Button>
    </Pane>
  )
}

NumeroVoieSelector.defaultProps = {
  voieId: null,
  nomVoie: '',
  mode: 'selection',
  validationMessage: null,
  selectedLanguages: null
}

NumeroVoieSelector.propTypes = {
  voieId: PropTypes.string,
  nomVoie: PropTypes.string,
  voies: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['creation', 'selection']),
  validationMessage: PropTypes.string,
  handleVoie: PropTypes.func.isRequired,
  handleNomVoie: PropTypes.func.isRequired,
  selectedLanguages: PropTypes.array,
  onAddLanguage: PropTypes.func.isRequired,
  onLanguageSelect: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  onRemoveLanguage: PropTypes.func.isRequired
}

export default NumeroVoieSelector
