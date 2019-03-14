import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Checkbox, Button, IconButton} from 'evergreen-ui'

import {useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'

import {CommuneSearch} from '../commune-search'

function CommuneAdd({onSubmit, onCancel, ...props}) {
  const [commune, setCommune] = useState(null)
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const setRef = useFocus()

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])

  const onFormSubmit = useCallback(e => {
    e.preventDefault()

    onSubmit({
      commune,
      populate
    })
  }, [onSubmit, commune, populate])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
  }, [onCancel])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <CommuneSearch
        required
        width='100%'
        maxWidth={500}
        innerRef={setRef}
        onSelect={onSelect}
        {...props}
      />

      <Checkbox
        checked={populate}
        label='Importer les données de la BAN'
        onChange={onPopulateChange}
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

CommuneAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default CommuneAdd
