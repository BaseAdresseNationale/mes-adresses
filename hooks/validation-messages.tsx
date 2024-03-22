import {useCallback, useState} from 'react'

export default function useValidationMessage() {
  const [validationMessages, _setValidationMessages] = useState<string[] | null>(null)

  const setValidationMessages = useCallback((validationMessages: string[]) => {
    _setValidationMessages(validationMessages)
    if (validationMessages) {
      throw new Error('Invalid Payload')
    }
  }, [])

  const getValidationMessages = useCallback((field: string) => {
    if (validationMessages && validationMessages.length > 0) {
      const messages = validationMessages.filter(message => message.includes(field))
      return messages && messages[0]
    }
  }, [validationMessages])

  return {getValidationMessages, setValidationMessages}
}
