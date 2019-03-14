import React, {useCallback, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInput, Button, IconButton} from 'evergreen-ui'

import {useInput} from '../../hooks/input'

function VoieAdd({onSubmit, onCancel}) {
  const focusRef = useRef()
  const [nom, onNomChange] = useInput()

  const onFormSubmit = useCallback(e => {
    e.preventDefault()

    onSubmit({
      nom
    })
  }, [onSubmit, nom])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
  }, [onCancel])

  const setRef = useCallback(ref => {
    focusRef.current = ref
  }, [])

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }, [focusRef])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <TextInput
        required
        innerRef={setRef}
        width='100%'
        maxWidth={500}
        value={nom}
        marginBottom={16}
        placeholder='Nom de la voie…'
        onChange={onNomChange}
      />

      <Button type='submit' appearance='primary' intent='success'>
        Ajouter
      </Button>

      {onCancel && (
        <IconButton
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

VoieAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default VoieAdd
