import {useCallback, useState} from 'react'

export default function useValidationMessage() {
  const [validationMessages, _setValidationMessages] = useState(null)

  const setValidationMessages = useCallback(validationMessages => {
    _setValidationMessages(validationMessages)
    if (validationMessages) {
      throw new Error('Invalid Payload')
    }
  }, [])

  const getValidationMessages = useCallback((field, index = null) => {
    if (validationMessages && validationMessages[field]) {
      return index === null ?
        validationMessages[field] :
        validationMessages[field][index]
    }
  }, [validationMessages])

  return [getValidationMessages, setValidationMessages]
}
