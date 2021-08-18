import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Button, Pane, Text, PlusIcon, PropertyIcon, SelectField, TextInputField} from 'evergreen-ui'

import useFocus from '../../../hooks/focus'

import {normalizeSort} from '../../../lib/normalize'

import AccentTool from '../../accent-tool'

function NumeroVoieSelector({voieId, voies, nomVoie, mode, handleVoie, handleNomVoie}) {
  const [isCreateMode, setIsCreateMode] = useState(mode === 'creation' || !voieId)
  const [cursorPosition, setCursorPosition] = useState({start: 0, end: 0})
  const focusRef = useFocus()

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
    <Pane display='flex' flex={1} alignItems='center'>
      <Pane>
        {isCreateMode ? (
          <Pane display='flex'>
            <TextInputField
              ref={focusRef}
              required
              label='Nouvelle voie'
              placeholder='Nom de la voie'
              value={nomVoie}
              onBlur={e => setCursorPosition({start: e.target.selectionStart, end: e.target.selectionEnd})}
              onChange={handleNomVoieChange}
            />
            <Pane
              display='flex'
              flexDirection='column'
              justifyContent='center'
              marginLeft={8}
              marginTop={3}
            >
              <AccentTool input={nomVoie} handleAccent={handleNomVoieChange} cursorPosition={cursorPosition} />
            </Pane>
          </Pane>
        ) : (
          <SelectField
            required
            label='Voie'
            flex={1}
            value={voieId}
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
