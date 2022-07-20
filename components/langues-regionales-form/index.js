import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {reduce} from 'lodash'
import {Button, AddIcon} from 'evergreen-ui'

import languesRegionales from '../../langues-regionales.json'

import LanguageField from './language-field'

function objectToArray(obj) {
  if (obj) {
    return Object.keys(obj).map((key, index) => {
      return {code: key, value: obj[key], id: index}
    })
  }

  return []
}

function languagesArrayToObj(arr) {
  const filtered = arr.filter(({code, value}) => code && value.length > 0)
  return reduce(filtered, (acc, current) => ({...acc, [current.code]: current.value}), {})
}

function LanguesRegionalesForm({initialValue, handleLanguages}) {
  const [nomAlt, setNomAlt] = useState(objectToArray(initialValue))

  const onAddForm = () => {
    setNomAlt(prev => [...prev, {code: null, value: '', id: prev.length}])
  }

  const onLanguageChange = useCallback(({code, value}, id) => {
    const index = nomAlt.findIndex(i => i.id === id)
    const updated = [...nomAlt]
    updated[index] = {code, value, id}

    setNomAlt(updated)
    handleLanguages(languagesArrayToObj(updated))
  }, [nomAlt, handleLanguages])

  const onRemoveLanguage = useCallback(id => {
    const filtered = nomAlt.filter(l => l.id !== id)

    setNomAlt(filtered)
    handleLanguages(languagesArrayToObj(filtered))
  }, [nomAlt, handleLanguages])

  useEffect(() => {
    handleLanguages(languagesArrayToObj(nomAlt))
  }, [nomAlt, handleLanguages])

  return (
    <>
      {nomAlt.map(language => (
        <LanguageField
          key={language.id}
          initialValue={language}
          languesRegionales={languesRegionales}
          availableLanguages={languesRegionales.filter(({code}) => !nomAlt.map(({code}) => code).includes(code))}
          onChange={value => onLanguageChange(value, language.id)}
          onDelete={() => onRemoveLanguage(language.id)}
        />
      ))}

      <Button
        type='button'
        appearance='primary'
        intent='success'
        iconBefore={AddIcon}
        width='100%'
        onClick={onAddForm}
        marginTop='1em'
        disabled={nomAlt.length >= languesRegionales.length}
      >
        Ajouter une langue régionale
      </Button>
    </>
  )
}

LanguesRegionalesForm.propTypes = {
  initialValue: PropTypes.object,
  handleLanguages: PropTypes.func.isRequired,
}

export default LanguesRegionalesForm
