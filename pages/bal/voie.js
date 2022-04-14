import React, {useState, useCallback, useEffect, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table} from 'evergreen-ui'

import {editNumero, getNumeros, getVoie, addVoie, addNumero} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'

import NumeroEditor from '@/components/bal/numero-editor'
import VoieHeading from '@/components/voie/voie-heading'
import NumerosList from '@/components/voie/numeros-list'

let needGeojsonUpdate = false

const Voie = React.memo(({baseLocale, commune}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  useHelp(3)

  const {token} = useContext(TokenContext)

  const {
    voie,
    numeros,
    reloadNumeros,
    reloadVoies,
    reloadGeojson,
    refreshBALSync,
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

  const resetEditing = useCallback(() => {
    setIsFormOpen(false)
    setEditingId(null)
  }, [setEditingId])

  const handleGeojsonRefresh = useCallback(async editedVoie => {
    if (editedVoie._id === voie._id) {
      needGeojsonUpdate = true
    } else {
      await reloadGeojson()
    }
  }, [voie._id, reloadGeojson])

  const onAdd = async (voieData, body) => {
    let editedVoie = voieData
    const isNewVoie = !editedVoie._id

    if (isNewVoie) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
      await reloadVoies()
    }

    await addNumero(editedVoie._id, body, token)
    await reloadNumeros()
    refreshBALSync()

    handleGeojsonRefresh(editedVoie)

    resetEditing()
  }

  const onEdit = useCallback(async (voieData, body) => {
    let editedVoie = voieData
    const isNewVoie = !editedVoie._id

    if (isNewVoie) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
    }

    await editNumero(editingId, {...body, voie: editedVoie._id}, token)
    await reloadNumeros()
    refreshBALSync()

    handleGeojsonRefresh(editedVoie)

    resetEditing()
  }, [baseLocale._id, commune.code, editingId, refreshBALSync, reloadNumeros, resetEditing, token, handleGeojsonRefresh])

  useEffect(() => {
    setIsFormOpen(Boolean(editedNumero))
  }, [editedNumero])

  useEffect(() => {
    if (!isEditing) {
      setIsFormOpen(false) // Force closing editing form when isEditing is false
    }
  }, [isEditing])

  useEffect(() => {
    return () => {
      if (needGeojsonUpdate) {
        reloadGeojson()
        needGeojsonUpdate = false
      }
    }
  }, [voie, reloadGeojson])

  return (
    <>
      <VoieHeading voie={voie} />

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
          numeros={numeros}
          isEditionDisabled={isEditing}
          handleEditing={handleEditing}
        />
      )}
    </>
  )
})

Voie.getInitialProps = async ({query}) => {
  const voie = await getVoie(query.idVoie)
  const numeros = await getNumeros(voie._id)

  return {
    voie,
    numeros
  }
}

Voie.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }).isRequired
}

export default Voie
