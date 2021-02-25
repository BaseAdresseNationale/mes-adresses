import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Autocomplete, TextInput} from 'evergreen-ui'

import useFuse from '../../hooks/fuse'

import BalDataContext from '../../contexts/bal-data'

function VoieSearch({selectedVoie, nomVoie, setNomVoie, onSelect}) {
  const {voies} = useContext(BalDataContext)
  const [filtered, onFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  const handleChange = useCallback(e => {
    onFilter(e.target.value)
    setNomVoie(e)
  }, [onFilter, setNomVoie])

  return (
    <Autocomplete
      isFilterDisabled
      selectedItem={selectedVoie}
      items={filtered}
      itemToString={item => item ? item.nom : nomVoie}
      onChange={onSelect}
    >
      {({getInputProps, getRef, inputValue}) => {
        return (
          <TextInput
            ref={getRef}
            required
            placeholder='Voie'
            value={nomVoie || inputValue}
            {...getInputProps({
              onChange: e => handleChange(e)
            })}
          />
        )
      }}
    </Autocomplete>
  )
}

VoieSearch.propTypes = {
  selectedVoie: PropTypes.object,
  nomVoie: PropTypes.string,
  setNomVoie: PropTypes.string,
  onSelect: PropTypes.func.isRequired
}

VoieSearch.defaultProps = {
  selectedVoie: null,
  nomVoie: null,
  setNomVoie: null
}

export default VoieSearch
