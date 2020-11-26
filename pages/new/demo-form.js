import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Checkbox, Button, Alert, PlusIcon} from 'evergreen-ui'

import {storeBalAccess} from '../../lib/tokens'
import {createBaseLocaleDemo} from '../../lib/bal-api'

import useFocus from '../../hooks/focus'
import {useCheckboxInput} from '../../hooks/input'

import {CommuneSearchField} from '../../components/commune-search'

function DemoForm({defaultCommune}) {
  const [isLoading, setIsLoading] = useState(false)

  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)
  const focusRef = useFocus()

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])
  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const bal = await createBaseLocaleDemo({commune, populate})

    storeBalAccess(bal._id, bal.token)

    Router.push(
      `/bal/commune?balId=${bal._id}&codeCommune=${commune}`,
      `/bal/${bal._id}/communes/${commune}`
    )
  }, [commune, populate])

  return (
    <Pane is='form' margin={16} padding={16} overflowY='scroll' background='white' onSubmit={onSubmit}>
      <CommuneSearchField
        required
        innerRef={focusRef}
        id='commune'
        initialSelectedItem={defaultCommune}
        label='Commune'
        maxWidth={500}
        disabled={isLoading}
        onSelect={onSelect}
      />

      <Checkbox
        label='Importer les voies et numéros depuis la BAN'
        checked={populate}
        disabled={isLoading}
        onChange={onPopulateChange}
      />

      <Alert
        intent='warning'
        title='Attention vous vous apprêtez à créer une Base Adresse Locale de démonstration.'
        marginY='1em'
      >
        Les adresses et voies créées depuis cette démonstration ne pourront pas être publiées dans la Base Adresse Nationale
      </Alert>

      <Button height={40} marginTop={8} type='submit' appearance='primary' intent='success' isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
        {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale de démonstration'}
      </Button>
    </Pane>
  )
}

DemoForm.propTypes = {
  defaultCommune: PropTypes.object
}

DemoForm.defaultProps = {
  defaultCommune: null
}

export default DemoForm
