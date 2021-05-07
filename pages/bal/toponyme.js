import React, {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Table, Button, Alert, AddIcon} from 'evergreen-ui'

import {editNumero, getNumerosToponyme, getToponyme} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'
import useFuse from '../../hooks/fuse'

import NumeroEditor from '../../components/bal/numero-editor'
import ToponymeNumeros from '../../components/toponyme/toponyme-numeros'
import AddNumeros from '../../components/toponyme/add-numeros'

import ToponymeHeading from './toponyme-heading'

const Toponyme = (({toponyme, defaultNumeros}) => {
  const [isEdited, setEdited] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [updatedToponyme, setUpdatedToponyme] = useState(toponyme)
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const {token} = useContext(TokenContext)

  const {
    numeros,
    reloadNumerosToponyme,
    editingId,
    setEditingId,
    isEditing,
    setIsEditing
  } = useContext(BalDataContext)

  useHelp(3)
  const [filtered, setFilter] = useFuse(numeros || defaultNumeros, 200, {
    keys: [
      'numero'
    ]
  })

  const editedNumero = filtered.find(numero => numero._id === editingId)

  const onAdd = useCallback(async numeros => {
    setIsLoading(true)

    try {
      await Promise.all(numeros.map(id => {
        return editNumero(id, {
          toponyme: toponyme._id
        }, token)
      }))
    } catch (error) {
      setError(error.message)
    }

    await reloadNumerosToponyme()

    setIsLoading(false)
    setIsAdding(false)
  }, [toponyme, token, reloadNumerosToponyme])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEdit = useCallback(async ({numero, toponyme, voie, suffixe, comment, positions}) => {
    try {
      await editNumero(editingId, {
        numero,
        toponyme,
        voie,
        suffixe,
        comment,
        positions
      }, token)

      await reloadNumerosToponyme(updatedToponyme._id || toponyme)
      setUpdatedToponyme(toponyme ? await getToponyme(toponyme) : updatedToponyme)
    } catch (error) {
      setError(error.message)
    }

    setEditingId(null)
  }, [editingId, setEditingId, reloadNumerosToponyme, token, updatedToponyme])

  const onCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
    setError(null)
  }, [setEditingId])

  useEffect(() => {
    if (editingId) {
      setEdited(false)
    }
  }, [editingId])

  useEffect(() => {
    if (isEdited) {
      setError(null)
      setEditingId(null)
    }
  }, [isEdited, setEditingId])

  useEffect(() => {
    setIsEditing(isAdding)
  }, [isAdding, setIsEditing])

  return (
    <>
      <ToponymeHeading defaultToponyme={toponyme} />
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor='white'
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane>
          <Heading>Liste des numéros</Heading>
        </Pane>
        {token && (
          <Pane marginLeft='auto'>
            <Button
              iconBefore={AddIcon}
              appearance='primary'
              intent='success'
              disabled={isAdding || isEditing}
              onClick={onEnableAdding}
            >
              Ajouter des numéros
            </Button>
          </Pane>
        )}
      </Pane>

      {error && (
        <Alert marginY={5} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Pane flex={1} overflowY='scroll'>
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              placeholder='Rechercher un numéro'
              onChange={setFilter}
            />
          </Table.Head>
          {isAdding && (
            <Table.Row height='auto'>
              <Table.Cell borderBottom display='block' paddingY={12} background='tint1'>
                <AddNumeros isLoading={isLoading} onSubmit={onAdd} onCancel={onCancel} />
              </Table.Cell>
            </Table.Row>
          )}

          {filtered.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun numéro
              </Table.TextCell>
            </Table.Row>
          )}

          {editingId && editingId !== toponyme._id ? (
            <Table.Row height='auto'>
              <Table.Cell display='block' paddingY={12} background='tint1'>
                <NumeroEditor
                  initialValue={editedNumero}
                  onSubmit={onEdit}
                  onCancel={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            <ToponymeNumeros numeros={filtered} handleSelect={setEditingId} />
          )}
        </Table>
      </Pane>
    </>
  )
})

Toponyme.getInitialProps = async ({baseLocale, commune, toponyme}) => {
  const defaultNumeros = await getNumerosToponyme(toponyme._id)

  return {
    layout: 'sidebar',
    toponyme,
    baseLocale,
    commune,
    defaultNumeros
  }
}

Toponyme.propTypes = {
  toponyme: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired
  }).isRequired,
  defaultNumeros: PropTypes.array
}

Toponyme.defaultProps = {
  defaultNumeros: null
}

export default Toponyme
