import React, {useState, useCallback, useEffect, useContext} from 'react'
import {Pane, Paragraph, Heading, Table, Button} from 'evergreen-ui'

import {addNumero, getNumeros, editNumero, removeNumero} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'

import useFuse from '../../hooks/fuse'

import TableRow from '../../components/table-row'
import NumeroEditor from '../../components/bal/numero-editor'

const Voie = React.memo(({baseLocale, commune, voie, defaultNumeros}) => {
  const [numeros, setNumeros] = useState(defaultNumeros)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const token = useContext(TokenContext)

  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: [
      'numeroComplet'
    ]
  })

  useEffect(() => {
    setNumeros(defaultNumeros)
  }, [defaultNumeros])

  const onAdd = useCallback(async ({numero, suffixe, positions}) => {
    await addNumero(voie._id, {
      numero,
      suffixe,
      positions
    }, token)

    const numeros = await getNumeros(voie._id)

    setIsAdding(false)
    setNumeros(numeros)
  }, [voie, token])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEnableEditing = useCallback(idNumero => {
    setIsAdding(false)
    setEditingId(idNumero)
  }, [])

  const onEdit = useCallback(async ({numero, suffixe, positions}) => {
    await editNumero(editingId, {
      numero,
      suffixe,
      positions
    }, token)

    const numeros = await getNumeros(voie._id)

    setEditingId(null)
    setNumeros(numeros)
  }, [editingId, voie._id, token])

  const onRemove = useCallback(async idNumero => {
    await removeNumero(idNumero, token)

    const numeros = await getNumeros(voie._id)

    setNumeros(numeros)
  }, [voie._id, token])

  const onCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
  }, [])

  return (
    <>
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
        {voie.positions.length === 0 && token && (
          <Pane marginLeft='auto'>
            <Button
              iconBefore='add'
              appearance='primary'
              intent='success'
              disabled={isAdding}
              onClick={onEnableAdding}
            >
              Ajouter un numéro
            </Button>
          </Pane>
        )}
      </Pane>

      <Pane flex={1} overflowY='scroll'>
        {voie.positions.length === 0 ? (
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
                  <NumeroEditor
                    onSubmit={onAdd}
                    onCancel={onCancel}
                  />
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
            {filtered.map(numero => numero._id === editingId ? (
              <Table.Row key={numero._id} height='auto'>
                <Table.Cell display='block' paddingY={12} background='tint1'>
                  <NumeroEditor
                    initialValue={numero}
                    onSubmit={onEdit}
                    onCancel={onCancel}
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              <TableRow
                key={numero._id}
                id={numero._id}
                isSelectable={!isAdding && !editingId && numero.positions.length > 1}
                label={numero.numeroComplet}
                secondary={numero.positions.length > 1 && `${numero.positions.length} positions`}
                onEdit={numero.positions.length === 1 && onEnableEditing}
                onRemove={onRemove}
              />
            ))}
          </Table>
        ) : (
          <Pane padding={16}>
            <Paragraph>
              La voie « {voie.nom} » est un toponyme et ne peut pas contenir de numéro.
            </Paragraph>
          </Pane>
        )}
      </Pane>
    </>
  )
})

Voie.getInitialProps = ({baseLocale, commune, voie, numeros}) => {
  return {
    layout: 'sidebar',
    baseLocale,
    commune,
    voie,
    defaultNumeros: numeros
  }
}

export default Voie
