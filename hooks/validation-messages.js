import {useCallback, useState} from 'react'

export default function useValidationMessage() {
  const [validationMessages, _setValidationMessages] = useState(null)

  const setValidationMessages = useCallback(validationMessages => {
    _setValidationMessages(validationMessages)
    if (validationMessages) {
      throw new Error('Invalid Payload')
    }
  }, [])

  const getValidationMessage = useCallback(index => {
    if (validationMessages && validationMessages[index]) {
      return validationMessages[index][0]
    }
  }, [validationMessages])

  return [getValidationMessage, setValidationMessages]
}
