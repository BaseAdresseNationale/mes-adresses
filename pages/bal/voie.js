import React, {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, Paragraph, Heading, Table, Button, Icon} from 'evergreen-ui'

import {editVoie, addNumero, editNumero, removeNumero, getNumeros} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'
import useFuse from '../../hooks/fuse'

import TableRow from '../../components/table-row'
import VoieEditor from '../../components/bal/voie-editor'
import NumeroEditor from '../../components/bal/numero-editor'

const Voie = React.memo(({voie, defaultNumeros}) => {
  const [voieName, setVoieName] = useState(voie.nom)
  const [isEdited, setEdited] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const {token} = useContext(TokenContext)

  const {
    voies,
    reloadVoies,
    numeros,
    reloadNumeros,
    editingId,
    setEditingId
  } = useContext(BalDataContext)

  useHelp(3)
  const [filtered, setFilter] = useFuse(numeros || defaultNumeros, 200, {
    keys: [
      'numeroComplet'
    ]
  })

  const onAdd = useCallback(async ({numero, suffixe, comment, positions}) => {
    await addNumero(voie._id, {
      numero,
      suffixe,
      comment,
      positions
    }, token)

    await reloadNumeros()

    setIsAdding(false)
  }, [voie._id, reloadNumeros, token])

  const onEditVoie = useCallback(async ({nom, positions}) => {
    await editVoie(voie._id, {
      nom,
      positions
    }, token)

    await reloadVoies()

    setEdited(false)
  }, [reloadVoies, token, voie._id])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEnableEditing = useCallback(idNumero => {
    setIsAdding(false)
    setEditingId(idNumero)
  }, [setEditingId])

  const onEdit = useCallback(async ({numero, suffixe, comment, positions}) => {
    await editNumero(editingId, {
      numero,
      suffixe,
      comment,
      positions
    }, token)

    await reloadNumeros()

    setEditingId(null)
  }, [editingId, setEditingId, reloadNumeros, token])

  const onRemove = useCallback(async idNumero => {
    await removeNumero(idNumero, token)
    await reloadNumeros()
  }, [reloadNumeros, token])

  const onCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
  }, [setEditingId])

  useEffect(() => {
    if (voies) {
      setVoieName(voies.find(v => v._id === voie._id).nom)
    }
  }, [voie._id, voies])

  return (
    <>
      <Pane
        display='flex'
        flexDirection='column'
        background='tint1'
        padding={16}
      >
        {isEdited ? (
          <VoieEditor
            initialValue={{...voie, nom: voieName}}
            onSubmit={onEditVoie}
            onCancel={() => setEdited(false)}
          />
        ) : (
          <Heading
            style={{cursor: hovered ? 'text' : 'default'}}
            onClick={() => setEdited(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {voieName}
            <Icon
              icon='edit'
              marginBottom={-2}
              marginLeft={8}
              color={hovered ? 'black' : 'muted'}
            />
          </Heading>
        )}
        {numeros && (
          <Text>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
        )}
      </Pane>

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
                comment={numero.comment}
                isSelectable={!isAdding && !editingId && numero.positions.length > 1}
                label={numero.numeroComplet}
                secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
                onEdit={onEnableEditing}
                onRemove={onRemove}
              />
            ))}
          </Table>
        ) : (
          <Pane padding={16}>
            <Paragraph>
              La voie « {voieName} » est un toponyme et ne peut pas contenir de numéro.
            </Paragraph>
          </Pane>
        )}
      </Pane>
    </>
  )
})

Voie.getInitialProps = async ({baseLocale, commune, voie}) => {
  const defaultNumeros = await getNumeros(voie._id)

  return {
    layout: 'sidebar',
    baseLocale,
    commune,
    voie,
    defaultNumeros
  }
}

Voie.propTypes = {
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired
  }).isRequired,
  defaultNumeros: PropTypes.array
}

Voie.defaultProps = {
  defaultNumeros: null
}

export default Voie
