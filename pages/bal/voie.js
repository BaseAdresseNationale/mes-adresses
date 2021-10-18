import React, {useState, useEffect, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table} from 'evergreen-ui'

import {editNumero, getNumeros, addVoie, addNumero} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'

import NumeroEditor from '../../components/bal/numero-editor'

import VoieHeading from './voie-heading'
import NumerosList from './voie/numeros-list'

const Voie = React.memo(({isHidden, baseLocale, commune, voie, defaultNumeros}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  useHelp(4)

  const {token} = useContext(TokenContext)

  const {
    numeros,
    reloadNumeros,
    isEditing,
    editingId,
    setEditingId,
    setIsEditing
  } = useContext(BalDataContext)

  const editedNumero = useMemo(() => (
    numeros?.find(numero => numero._id === editingId)
  ), [numeros, editingId])

  const handleEditing = numeroId => {
    setIsEditing(true)
    setIsFormOpen(true)
    if (numeroId) {
      setEditingId(numeroId)
    }
  }

  const resetEditing = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const onAdd = async (voieData, body) => {
    let editedVoie = voieData
    if (!editedVoie._id) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
    }

    await addNumero(editedVoie._id, body, token)
    await reloadNumeros()

    resetEditing()
  }

  const onEdit = async (voieData, body) => {
    let editedVoie = voieData
    if (!editedVoie._id) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
    }

    await editNumero(editingId, {...body, voie: editedVoie._id}, token)

    await reloadNumeros()

    resetEditing()
  }

  useEffect(() => {
    setIsFormOpen(Boolean(editedNumero))
  }, [editedNumero])

  return (
    <>
      <VoieHeading defaultVoie={voie} />

      {isFormOpen ? (
        <Pane flex={1} overflowY='scroll'>
          <Table.Row height='auto'>
            <Table.Cell display='block' paddingY={12} background='tint1'>
              <NumeroEditor
                isSidebar
                initialVoieId={voie._id}
                initialValue={editedNumero}
                commune={commune}
                isHidden={isHidden}
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
  isHidden: PropTypes.bool.isRequired,
  defaultNumeros: PropTypes.array
}

Voie.defaultProps = {
  defaultNumeros: null
}

export default Voie
