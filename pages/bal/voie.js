import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, Paragraph, Heading, Table, Button, Checkbox, Alert, EditIcon, AddIcon} from 'evergreen-ui'

import {editVoie, addNumero, editNumero, removeNumero, getNumeros} from '../../lib/bal-api'

import {getFullVoieName} from '../../lib/voie'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'
import useFuse from '../../hooks/fuse'

import TableRow from '../../components/table-row'
import VoieEditor from '../../components/bal/voie-editor'
import NumeroEditor from '../../components/bal/numero-editor'
import DeleteWarning from '../../components/delete-warning'
import GroupedActions from '../../components/grouped-actions'

const Voie = React.memo(({voie, defaultNumeros}) => {
  const [editedVoie, setEditedVoie] = useState(voie)
  const [isEdited, setEdited] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState()
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false)

  const {token} = useContext(TokenContext)

  const currentVoie = editedVoie || voie

  const {
    baseLocale,
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

  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])
  const filteredSelected = filtered.filter(({_id}) => selectedNumerosIds.includes(_id))

  const isGroupedActionsShown = useMemo(() => token && selectedNumerosIds.length > 1, [token, selectedNumerosIds])

  const isAllSelected = useMemo(() => numeros && ((filtered.length === numeros.length && (selectedNumerosIds.length === numeros.length)) ||
  (filtered.length !== numeros.length && (filtered.length === filteredSelected.length))), [selectedNumerosIds, numeros, filtered, filteredSelected])

  const toEdit = useMemo(() => numeros && (filtered.length === numeros.length) ? selectedNumerosIds : filteredSelected.map(({_id}) => _id), [filtered, numeros, selectedNumerosIds, filteredSelected])

  const handleSelect = id => {
    setSelectedNumerosIds(selectedNumerosIds => {
      if (selectedNumerosIds.includes(id)) {
        return selectedNumerosIds.filter(f => f !== id)
      }

      return [...selectedNumerosIds, id]
    })
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNumerosIds([])
    } else {
      setSelectedNumerosIds(filtered.map(({_id}) => _id))
    }
  }

  const editedNumero = filtered.find(numero => numero._id === editingId)

  const onAdd = useCallback(async ({numero, suffixe, comment, positions}) => {
    await addNumero(voie._id, {
      numero,
      suffixe,
      comment,
      positions
    }, token)

    await reloadNumeros()

    setIsAdding(false)
  }, [voie, reloadNumeros, token])

  const onEditVoie = useCallback(async ({nom, typeNumerotation, trace, complement, positions}) => {
    const editedVoie = await editVoie(voie._id, {
      nom,
      typeNumerotation,
      trace,
      complement,
      positions
    }, token)

    setEditingId(null)
    await reloadVoies()

    setEditedVoie(editedVoie)
  }, [reloadVoies, setEditingId, token, voie])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEnableEditing = useCallback(idNumero => {
    setIsAdding(false)
    setEditingId(idNumero)
  }, [setEditingId])

  const onEnableVoieEditing = useCallback(() => {
    setEditingId(voie._id)
    setHovered(false)
  }, [setEditingId, voie._id])

  const onEdit = useCallback(async ({numero, voie, suffixe, comment, positions}) => {
    await editNumero(editingId, {
      numero,
      voie,
      suffixe,
      comment,
      positions
    }, token)

    await reloadNumeros()

    setEditingId(null)
  }, [editingId, setEditingId, reloadNumeros, token])

  const onMultipleEdit = useCallback(async body => {
    await Promise.all(body.map(async numero => {
      try {
        await editNumero(numero._id, {
          ...numero
        }, token)
      } catch (error) {
        setError(error.message)
      }
    }))

    await reloadNumeros()
  }, [reloadNumeros, token])

  const onRemove = useCallback(async idNumero => {
    await removeNumero(idNumero, token)
    await reloadNumeros()
  }, [reloadNumeros, token])

  const onMultipleRemove = useCallback(async numeros => {
    await Promise.all(numeros.map(async numero => {
      try {
        await onRemove(numero)
      } catch (error) {
        setError(error.message)
      }
    }))

    await reloadNumeros()

    setSelectedNumerosIds([])
    setIsRemoveWarningShown(false)
  }, [reloadNumeros, onRemove, setSelectedNumerosIds])

  const onCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
  }, [setEditingId])

  useEffect(() => {
    if (editingId) {
      setEdited(false)
    }
  }, [editingId])

  useEffect(() => {
    if (isEdited) {
      setEditingId(null)
    }
  }, [isEdited, setEditingId])

  useEffect(() => {
    if (voie) {
      setEditedVoie(null)
    }
  }, [voie])

  return (
    <>
      <Pane
        display='flex'
        flexDirection='column'
        background='tint1'
        padding={16}
      >
        {editingId === voie._id ? (
          <VoieEditor
            hasNumeros={numeros.length > 0}
            initialValue={{...currentVoie}}
            isEnabledComplement={Boolean(baseLocale.enableComplement)}
            onSubmit={onEditVoie}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <Heading
            style={{cursor: hovered ? 'text' : 'default'}}
            onClick={onEnableVoieEditing}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {getFullVoieName(currentVoie, baseLocale.enableComplement)}
            <EditIcon
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
        {currentVoie.positions.length === 0 && token && (
          <Pane marginLeft='auto'>
            <Button
              iconBefore={AddIcon}
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

      {isGroupedActionsShown && (
        <GroupedActions
          idVoie={voie._id}
          numeros={numeros}
          selectedNumerosIds={toEdit}
          resetSelectedNumerosIds={() => setSelectedNumerosIds([])}
          setIsRemoveWarningShown={setIsRemoveWarningShown}
          onSubmit={onMultipleEdit}
        />
      )}

      <DeleteWarning
        isShown={isRemoveWarningShown}
        content={(
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer tous les numéros sélectionnés ?
          </Paragraph>
        )}
        onCancel={() => setIsRemoveWarningShown(false)}
        onConfirm={() => onMultipleRemove(toEdit)}
      />

      {error && (
        <Alert marginY={5} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Pane flex={1} overflowY='scroll'>
        {currentVoie.positions.length === 0 ? (
          <Table>
            <Table.Head>
              {!editingId && numeros && token && filtered.length > 1 && (
                <Table.Cell flex='0 1 1'>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </Table.Cell>
              )}
              <Table.SearchHeaderCell
                placeholder='Rechercher un numéro'
                onChange={setFilter}
              />
            </Table.Head>
            {isAdding && (
              <Table.Row height='auto'>
                <Table.Cell borderBottom display='block' paddingY={12} background='tint1'>
                  <NumeroEditor
                    initialVoie={voie}
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
            {editingId && editingId !== voie._id ? (
              <Table.Row height='auto'>
                <Table.Cell display='block' paddingY={12} background='tint1'>
                  <NumeroEditor
                    initialVoie={voie}
                    initialValue={editedNumero}
                    onSubmit={onEdit}
                    onCancel={onCancel}
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              filtered.map(numero => (
                <TableRow
                  {...numero}
                  key={numero._id}
                  id={numero._id}
                  comment={numero.comment}
                  isSelectable={!isAdding && !editingId && numero.positions.length > 1}
                  label={numero.numeroComplet}
                  secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
                  handleSelect={handleSelect}
                  isSelected={selectedNumerosIds.includes(numero._id)}
                  onEdit={onEnableEditing}
                  onRemove={onRemove}
                />
              ))
            )}
          </Table>
        ) : (
          <Pane padding={16}>
            <Paragraph>
              La voie « {currentVoie.nom} » est un toponyme et ne peut pas contenir de numéro.
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
    voie,
    baseLocale,
    commune,
    defaultNumeros
  }
}

Voie.propTypes = {
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    complement: PropTypes.string,
    positions: PropTypes.array.isRequired
  }).isRequired,
  defaultNumeros: PropTypes.array
}

Voie.defaultProps = {
  defaultNumeros: null
}

export default Voie
