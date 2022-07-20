import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {omit} from 'lodash'
import {Button, AddIcon} from 'evergreen-ui'

import languesRegionales from '../../langues-regionales.json'

import LanguageField from './language-field'

function objectToArray(obj) {
  return Object.keys(obj).map(key => {
    return {code: key, value: obj[key]}
  })
}

function LanguesRegionalesForm({initialValue, handleLanguages}) {
  const [nomAlt, setNomAlt] = useState(initialValue)
  const [forms, setForms] = useState(initialValue ? objectToArray(initialValue) : [])

  const onAddForm = () => {
    setForms(prev => [...prev, {code: null, value: ''}])
  }

  const onLanguageChange = useCallback(({code, value}) => {
    setNomAlt(prev => {
      const alt = {...prev}
      alt[code] = value

      return alt
    })
  }, [])

  const onRemoveLanguage = useCallback(code => {
    setNomAlt(prev => {
      return omit(prev, code)
    })
  }, [])

  useEffect(() => {
    handleLanguages(nomAlt)
    setForms(objectToArray(nomAlt))
  }, [nomAlt, handleLanguages])

  return (
    <>
      {forms.map((language, index) => (
        <LanguageField
          key={language.code || index}
          initialValue={language}
          languesRegionales={languesRegionales}
          availableLanguages={languesRegionales.filter(({code}) => !Object.keys(nomAlt).includes(code))}
          onChange={onLanguageChange}
          onDelete={onRemoveLanguage}
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
