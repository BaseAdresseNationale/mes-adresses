import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Autocomplete, SearchInput} from 'evergreen-ui'
import {useDebouncedCallback} from 'use-debounce'

import {searchCommunes} from '../../lib/geo-api'

function CommuneSearch({placeholder, exclude, innerRef, defaultSelectedItem, onSelect, ...props}) {
  const [communes, setCommunes] = useState([])

  const [onSearch] = useDebouncedCallback(async value => {
    const result = await searchCommunes(value, {
      fields: 'departement',
      limit: 7
    })

    setCommunes(result
      .filter(c => c.departement) // Filter communes without departements
      .filter(c => !exclude.includes(c.code))
    )
  }, 300, [exclude])

  return (
    <Autocomplete
      isFilterDisabled
      defaultSelectedItem={defaultSelectedItem}
      items={communes}
      itemToString={item => item ? `${item.nom} (${item.departement.nom} - ${item.departement.code})` : ''}
      onChange={onSelect}
    >
      {({getInputProps, getRef, inputValue}) => {
        return (
          <SearchInput
            placeholder={placeholder}
            value={inputValue}
            innerRef={ref => {
              if (innerRef) {
                innerRef(ref)
              }

              return getRef(ref)
            }}
            {...getInputProps({
              onChange: e => onSearch(e.target.value)
            })}
            {...props}
          />
        )
      }}
    </Autocomplete>
  )
}

CommuneSearch.propTypes = {
  defaultSelectedItem: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    departement: PropTypes.shape({
      code: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired
    }).isRequired
  }),
  placeholder: PropTypes.string,
  exclude: PropTypes.array,
  innerRef: PropTypes.func,
  onSelect: PropTypes.func
}

CommuneSearch.defaultProps = {
  defaultSelectedItem: null,
  placeholder: 'Chercher une commune…',
  exclude: [],
  innerRef: () => {},
  onSelect: () => {}
}

export default CommuneSearch
