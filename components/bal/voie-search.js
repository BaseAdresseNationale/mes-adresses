import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Autocomplete, TextInput} from 'evergreen-ui'

import useFuse from '../../hooks/fuse'

import BalDataContext from '../../contexts/bal-data'

function VoieSearch({defaultVoie, onSelect}) {
  const {voies} = useContext(BalDataContext)
  const [filtered, onFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  return (
    <Autocomplete
      isFilterDisabled
      selectedItem={defaultVoie}
      items={filtered}
      itemToString={item => item ? item.nom : ''}
      onChange={onSelect}
    >
      {({getInputProps, getRef, inputValue}) => {
        return (
          <TextInput
            required
            placeholder='Voie'
            value={defaultVoie ? defaultVoie.nom : inputValue}
            innerRef={getRef}
            {...getInputProps({
              onChange: e => onFilter(e.target.value)
            })}
          />
        )
      }}
    </Autocomplete>
  )
}

VoieSearch.propTypes = {
  defaultVoie: PropTypes.object,
  onSelect: PropTypes.func.isRequired
}

VoieSearch.defaultProps = {
  defaultVoie: null
}

export default VoieSearch
