import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Button, Pane, Text, PlusIcon, PropertyIcon, SelectField} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import AssistedTextField from '@/components/assisted-text-field'

function NumeroVoieSelector({voieId, voies, nomVoie, mode, handleVoie, handleNomVoie}) {
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
          <AssistedTextField
            isFocus
            label='Nouvelle voie'
            placeholder='Nom de la voie'
            value={nomVoie}
            onChange={handleNomVoieChange}
          />
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
  mode: 'selection'
}

NumeroVoieSelector.propTypes = {
  voieId: PropTypes.string,
  nomVoie: PropTypes.string,
  voies: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['creation', 'selection']),
  handleVoie: PropTypes.func.isRequired,
  handleNomVoie: PropTypes.func.isRequired
}

export default NumeroVoieSelector
