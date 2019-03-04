import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Autocomplete, SearchInput} from 'evergreen-ui'
import {debounce} from 'lodash'

function isCodeDep(token) {
  return ['2A', '2B'].includes(token) || token.match(/^\d{2,3}$/)
}

function CommuneSearch({placeholder, exclude, onSelect, ...props}) {
  const [communes, setCommunes] = useState([])

  const onSearch = debounce(async value => {
    const url = new URL('https://geo.api.gouv.fr/communes')
    url.searchParams.set('nom', value)
    url.searchParams.set('fields', 'departement,contour')
    url.searchParams.set('limit', 7)

    const codeDep = value.split(' ').find(isCodeDep)
    if (codeDep) {
      url.searchParams.set('codeDepartement', codeDep)
    }

    const res = await fetch(url)
    const result = await res.json()

    setCommunes(result.filter(c => !exclude.includes(c.code)))
  }, 300)

  return (
    <Autocomplete
      isFilterDisabled
      items={communes}
      itemToString={item => item ? `${item.nom} (${item.departement.nom} - ${item.departement.code})` : ''}
      onChange={onSelect}
    >
      {({getInputProps, getRef, inputValue}) => {
        return (
          <SearchInput
            placeholder={placeholder}
            value={inputValue}
            innerRef={getRef}
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
  placeholder: PropTypes.string,
  exclude: PropTypes.array,
  onSelect: PropTypes.func
}

CommuneSearch.defaultProps = {
  placeholder: 'Chercher une commune…',
  exclude: [],
  onSelect: () => {}
}

export default CommuneSearch
