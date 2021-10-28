import React, {useState, useCallback, useEffect, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table} from 'evergreen-ui'

import {editNumero, getNumeros, addVoie, addNumero} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'

import NumeroEditor from '../../components/bal/numero-editor'

import VoieHeading from './voie-heading'
import NumerosList from './voie/numeros-list'

const Voie = React.memo(({baseLocale, commune, voie, defaultNumeros}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  useHelp(4)

  const {token} = useContext(TokenContext)

  const {
    numeros,
    reloadNumeros,
    reloadVoies,
    reloadGeojson,
    isEditing,
    editingId,
    setEditingId,
    setIsEditing
  } = useContext(BalDataContext)

  const editedNumero = useMemo(() => (
    numeros?.find(numero => numero._id === editingId)
  ), [numeros, editingId])

  const handleEditing = useCallback(numeroId => {
    setIsEditing(true)
    setIsFormOpen(true)
    if (numeroId) {
      setEditingId(numeroId)
    }
  }, [setIsEditing, setEditingId])

  const resetEditing = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const onAdd = async (voieData, body) => {
    let editedVoie = voieData
    const isNewVoie = !editedVoie._id

    if (isNewVoie) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
      await reloadVoies()
    }

    await addNumero(editedVoie._id, body, token)
    await reloadNumeros()

    if (editedVoie._id !== voie._id || isNewVoie) {
      await reloadGeojson()
    }

    resetEditing()
  }

  const onEdit = async (voieData, body) => {
    let editedVoie = voieData
    const isNewVoie = !editedVoie._id

    if (isNewVoie) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
    }

    await editNumero(editingId, {...body, voie: editedVoie._id}, token)
    await reloadNumeros()

    if (editedVoie._id !== voie._id || isNewVoie) {
      await reloadGeojson()
    }

    resetEditing()
  }

  useEffect(() => {
    setIsFormOpen(Boolean(editedNumero))
  }, [editedNumero])

  useEffect(() => {
    if (!isEditing) {
      setIsFormOpen(false) // Force closing editing form when isEditing is false
    }
  }, [isEditing])

  return (
    <>
      <VoieHeading defaultVoie={voie} />

      {isFormOpen ? (
        <Pane flex={1} overflowY='scroll'>
          <Table.Row height='auto'>
            <Table.Cell display='block' padding={0} background='tint1'>
              <NumeroEditor
                hasPreview
                initialVoieId={voie._id}
                initialValue={editedNumero}
                commune={commune}
                onSubmit={editedNumero ? onEdit : onAdd}
                onCancel={resetEditing}
              />
            </Table.Cell>
          </Table.Row>
        </Pane>
      ) : (
        <NumerosList
          token={token}
          voieId={voie._id}
          defaultNumeros={defaultNumeros}
          disabledEdition={isEditing}
          handleEditing={handleEditing}
        />
      )}
    </>
  )
})

Voie.getInitialProps = async ({baseLocale, commune, voie}) => {
  const defaultNumeros = await getNumeros(voie._id)

  return {
    layout: 'sidebar',
    voie,
    baseLocale,
    commune,
    defaultNumeros
  }
}

Voie.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }).isRequired,
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  defaultNumeros: PropTypes.array
}

Voie.defaultProps = {
  defaultNumeros: null
}

export default Voie
