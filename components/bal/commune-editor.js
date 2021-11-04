import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Checkbox, Button, IconButton, Alert, UndoIcon} from 'evergreen-ui'

import {useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import {CommuneSearch} from '../commune-search'

function CommuneEditor({onSubmit, onCancel, ...props}) {
  const [isLoading, setIsLoading] = useState(false)
  const [commune, setCommune] = useState(null)
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [error, setError] = useState()
  const [setRef] = useFocus()

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await onSubmit({
        commune,
        populate
      })
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [onSubmit, commune, populate])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
  }, [onCancel])

  useKeyEvent(({key}) => {
    if (key === 'Escape') {
      onCancel()
    }
  }, [onCancel], 'keyup')

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <CommuneSearch
        required
        disabled={isLoading}
        width='100%'
        maxWidth={500}
        innerRef={setRef}
        onSelect={onSelect}
        {...props}
      />

      <Checkbox
        checked={populate}
        label='Importer les données de la BAN'
        disabled={isLoading}
        onChange={onPopulateChange}
      />

      {error && (
        <Alert marginBottom={16} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success'>
        {isLoading ? 'En cours…' : 'Ajouter'}
      </Button>

      {onCancel && (
        <IconButton
          disabled={isLoading}
          icon={UndoIcon}
          appearance='minimal'
          marginLeft={8}
          display='inline-flex'
          onClick={onFormCancel}
        />
      )}
    </Pane>
  )
}

CommuneEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

CommuneEditor.defaultProps = {
  onCancel: null
}

export default CommuneEditor
