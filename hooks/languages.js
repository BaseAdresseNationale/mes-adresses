import {useState} from 'react'
import {uniqueId} from 'lodash'

export default function useLanguages(initialValue) {
  const initialLanguageList = initialValue && Object.keys(initialValue).map(language => {
    return {label: initialValue[language], value: language, disabled: true, id: uniqueId()}
  })

  const [selectedLanguages, setSelectedLanguages] = useState(initialLanguageList || [])

  const onAddLanguage = () => {
    setSelectedLanguages([...selectedLanguages, {label: '', value: '', disabled: false, id: uniqueId()}])
  }

  const handleLanguageSelect = (codeISO, index) => {
    selectedLanguages[index].value = codeISO
    setSelectedLanguages([...selectedLanguages])
  }

  const handleLanguageChange = (event, index) => {
    selectedLanguages[index].label = event.target.value
    setSelectedLanguages([...selectedLanguages])
  }

  const removeLanguage = index => {
    selectedLanguages.splice(index, 1)
    setSelectedLanguages([...selectedLanguages])
  }

  return [selectedLanguages, onAddLanguage, handleLanguageSelect, handleLanguageChange, removeLanguage]
}

