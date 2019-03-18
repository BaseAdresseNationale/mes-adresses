import React, {useState, useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInput, Button, IconButton} from 'evergreen-ui'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

function VoieEditor({initialValue, onSubmit, onCancel}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const setRef = useFocus()

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await onSubmit({
        nom
      })
    } catch (error) {
      setIsLoading(false)
    }
  }, [onSubmit, nom])

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
        disabled={isLoading}
        innerRef={setRef}
        width='100%'
        maxWidth={500}
        value={nom}
        marginBottom={16}
        placeholder='Nom de la voie…'
        onChange={onNomChange}
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

VoieEditor.propTypes = {
  initialValue: PropTypes.shape({
    nom: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default VoieEditor
