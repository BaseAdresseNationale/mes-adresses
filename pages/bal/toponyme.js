import {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Table, Button, Alert, AddIcon} from 'evergreen-ui'

import {addVoie, editNumero, batchNumeros, getToponyme, getNumerosToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'
import useFuse from '@/hooks/fuse'

import NumeroEditor from '@/components/bal/numero-editor'
import ToponymeNumeros from '@/components/toponyme/toponyme-numeros'
import AddNumeros from '@/components/toponyme/add-numeros'
import ToponymeHeading from '@/components/toponyme/toponyme-heading'

function Toponyme({baseLocale, commune}) {
  const [isEdited, setEdited] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const {token} = useContext(TokenContext)

  const {
    toponyme,
    numeros,
    reloadNumeros,
    editingId,
    setEditingId,
    isEditing,
    setIsEditing
  } = useContext(BalDataContext)

  useHelp(2)
  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: [
      'numero'
    ]
  })

  const editedNumero = filtered.find(numero => numero._id === editingId)

  const onAdd = async numeros => {
    setIsLoading(true)

    try {
      await batchNumeros(baseLocale._id, {
        numerosIds: numeros,
        changes: {toponyme: toponyme._id}
      }, token)

      await reloadNumeros()
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
    setIsAdding(false)
    setIsEditing(false)
  }

  const onEnableAdding = () => {
    setIsAdding(true)
    setIsEditing(true)
  }

  const onEdit = useCallback(async (voieData, body) => {
    let editedVoie = voieData

    try {
      if (!editedVoie._id) {
        editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
      }

      await editNumero(editingId, {...body, voie: editedVoie._id}, token)
      await reloadNumeros()
    } catch (error) {
      setError(error.message)
    }

    setEditingId(null)
  }, [editingId, setEditingId, baseLocale, commune.code, reloadNumeros, token])

  const handleSelection = useCallback(id => {
    if (!isEditing) {
      setEditingId(id)
    }
  }, [isEditing, setEditingId])

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
    if (!isEditing) {
      setIsAdding(false) // Force closing editing form when isEditing is false
    }
  }, [isEditing, setIsAdding])

  return (
    <>
      <ToponymeHeading toponyme={toponyme} />
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
          {!isEditing && (
            <Table.Head>
              <Table.SearchHeaderCell
                placeholder='Rechercher un numéro'
                onChange={setFilter}
              />
            </Table.Head>
          )}

          {isAdding && (
            <Table.Row height='auto' >
              <Table.Cell borderBottom display='block' padding={0} background='tint1'>
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
              <Table.Cell display='block' padding={0} background='tint1'>
                <NumeroEditor
                  hasPreview
                  initialValue={editedNumero}
                  commune={commune}
                  onSubmit={onEdit}
                  onCancel={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            <ToponymeNumeros numeros={filtered} handleSelect={handleSelection} isEditable={token && !isEditing} />
          )}
        </Table>
      </Pane>
    </>
  )
}

Toponyme.getInitialProps = async ({query}) => {
  const toponyme = await getToponyme(query.idToponyme)
  const numeros = await getNumerosToponyme(toponyme._id)

  return {
    toponyme,
    numeros
  }
}

Toponyme.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }).isRequired
}

export default Toponyme
