import React, {useState, useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInput, Button, IconButton} from 'evergreen-ui'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

function NumeroEditor({initialValue, onSubmit, onCancel}) {
  const [isLoading, setIsLoading] = useState(false)
  const [numero, onNumeroChange] = useInput(initialValue ? initialValue.numero : '')
  const [suffixe, onSuffixeChange] = useInput(initialValue ? initialValue.suffixe : '')
  const setRef = useFocus()

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await onSubmit({
        numero,
        suffixe
      })
    } catch (error) {
      setIsLoading(false)
    }
  }, [onSubmit, numero, suffixe])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
  }, [onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return initialValue ? 'Modifier' : 'Ajouter'
  }, [initialValue, isLoading])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      onCancel()
    }
  }, [onCancel])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <TextInput
        required
        display='block'
        type='number'
        disabled={isLoading}
        innerRef={setRef}
        width='100%'
        maxWidth={300}
        value={numero}
        maxLength={200}
        marginBottom={16}
        placeholder='Numéro'
        onChange={onNumeroChange}
      />

      <TextInput
        display='block'
        disabled={isLoading}
        width='100%'
        maxWidth={120}
        value={suffixe}
        maxLength={200}
        marginBottom={16}
        placeholder='Suffixe'
        onChange={onSuffixeChange}
      />

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success'>
        {submitLabel}
      </Button>

      {onCancel && (
        <IconButton
          disabled={isLoading}
          icon='undo'
          appearance='minimal'
          marginLeft={8}
          display='inline-flex'
          onClick={onFormCancel}
        />
      )}
    </Pane>
  )
}

NumeroEditor.propTypes = {
  initialValue: PropTypes.shape({
    numero: PropTypes.string,
    suffixe: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default NumeroEditor
