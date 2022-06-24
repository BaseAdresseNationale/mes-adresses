import {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Table, Button, Alert, AddIcon} from 'evergreen-ui'

import {batchNumeros, getToponyme, getNumerosToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'
import useFuse from '@/hooks/fuse'

import NumeroEditor from '@/components/bal/numero-editor'
import ToponymeNumeros from '@/components/toponyme/toponyme-numeros'
import AddNumeros from '@/components/toponyme/add-numeros'
import ToponymeHeading from '@/components/toponyme/toponyme-heading'

function Toponyme({baseLocale, commune}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editedNumeroId, setEditedNumeroId] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {token} = useContext(TokenContext)

  const {
    toponyme,
    numeros,
    reloadNumeros,
    isEditing,
    setIsEditing,
    isDeleted
  } = useContext(BalDataContext)

  useHelp(2)
  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: [
      'numero'
    ]
  })

  const editedNumero = useMemo(() => {
    return filtered.find(numero => numero._id === editedNumeroId)
  }, [filtered, editedNumeroId])

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
    setIsFormOpen(false)
    setIsEditing(false)
  }

  const onEnableAdding = () => {
    setIsFormOpen(true)
    setIsEditing(true)
  }

  const onCancel = useCallback(() => {
    if (isFormOpen) {
      setIsEditing(false)
    }

    setEditedNumeroId(null)
    setIsFormOpen(false)
    setError(null)
  }, [isFormOpen, setIsEditing])

  useEffect(() => {
    return () => {
      setIsEditing(false)
    }
  }, [setIsEditing])

  // Load protected fields (ex: 'comment')
  useEffect(() => {
    if (token) {
      reloadNumeros()
    }
  }, [token, reloadNumeros])

  return (
    <>
      <ToponymeHeading toponyme={toponyme} commune={commune} />
      {token && isFormOpen && isEditing ? (
        <AddNumeros isLoading={isLoading} onSubmit={onAdd} onCancel={onCancel} />
      ) : (
        <Pane
          flexShrink={0}
          elevation={0}
          backgroundColor='white'
          padding={16}
          display='flex'
          alignItems='center'
          minHeight={64}
        >
          <Heading>Liste des numéros</Heading>
          {!isDeleted && (
            <Pane marginLeft='auto'>
              <Button
                iconBefore={AddIcon}
                appearance='primary'
                intent='success'
                disabled={isEditing}
                onClick={onEnableAdding}
              >
                Ajouter des numéros
              </Button>
            </Pane>
          )}
        </Pane>
      )}

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

          {filtered.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun numéro
              </Table.TextCell>
            </Table.Row>
          )}

          {editedNumero ? (
            <Table.Row height='auto'>
              <Table.Cell display='block' padding={0} background='tint1'>
                <NumeroEditor
                  hasPreview
                  initialValue={editedNumero}
                  commune={commune}
                  closeForm={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            <ToponymeNumeros numeros={filtered} handleSelect={setEditedNumeroId} isEditable={token && !isEditing} />
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
  commune: PropTypes.object.isRequired
}

export default Toponyme
