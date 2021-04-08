import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {groupBy} from 'lodash'
import {Pane, Paragraph, Heading, Table, Button, Checkbox, Alert, AddIcon} from 'evergreen-ui'

import {addNumero, editNumero, removeNumero, getNumerosToponyme, getToponyme} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'
import useFuse from '../../hooks/fuse'

import TableRow from '../../components/table-row'
import NumeroEditor from '../../components/bal/numero-editor'
import DeleteWarning from '../../components/delete-warning'
import GroupedActions from '../../components/grouped-actions'

import ToponymeHeading from './toponyme-heading'

const Toponyme = (({toponyme, defaultNumeros}) => {
  const [isEdited, setEdited] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState()
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false)
  const [updatedToponyme, setUpdatedToponyme] = useState(toponyme)

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

  const numerosByVoie = groupBy(filtered.sort((a, b) => a.numero - b.numero), d => d.voie[0].nom)

  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])

  const isGroupedActionsShown = useMemo(() => token && selectedNumerosIds.length > 1, [token, selectedNumerosIds])
  const noFilter = numeros && filtered.length === numeros.length
  const allNumerosSelected = noFilter && (selectedNumerosIds.length === numeros.length)
  const allFilteredNumerosSelected = !noFilter && (filtered.length === selectedNumerosIds.length)

  const isAllSelected = useMemo(() => allNumerosSelected || allFilteredNumerosSelected, [allFilteredNumerosSelected, allNumerosSelected])

  const toEdit = useMemo(() => {
    if (numeros && noFilter) {
      return selectedNumerosIds
    }

    return selectedNumerosIds.map(({_id}) => _id)
  }, [numeros, selectedNumerosIds, noFilter])

  const handleSelect = id => {
    setSelectedNumerosIds(selectedNumero => {
      if (selectedNumero.includes(id)) {
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

  const onAdd = useCallback(async ({numero, suffixe, comment, positions, voie}) => {
    await addNumero(voie, {
      numero,
      suffixe,
      comment,
      positions,
      toponyme: toponyme._id
    }, token)

    reloadNumerosToponyme(toponyme._id)

    setIsAdding(false)
  }, [toponyme, token, reloadNumerosToponyme])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEnableEditing = useCallback(idNumero => {
    setIsAdding(false)
    setEditingId(idNumero)
  }, [setEditingId])

  const onEdit = useCallback(async ({numero, toponyme, voie, suffixe, comment, positions}) => {
    await editNumero(editingId, {
      numero,
      toponyme: toponyme ? toponyme._id || toponyme : null,
      voie,
      suffixe,
      comment,
      positions
    }, token)

    await reloadNumerosToponyme(updatedToponyme._id || toponyme)
    setUpdatedToponyme(toponyme ? await getToponyme(toponyme) : updatedToponyme)

    setEditingId(null)
  }, [editingId, setEditingId, reloadNumerosToponyme, token, updatedToponyme])

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

    await reloadNumerosToponyme()
  }, [reloadNumerosToponyme, token])

  const onRemove = useCallback(async idNumero => {
    await removeNumero(idNumero, token)
    reloadNumerosToponyme()
  }, [reloadNumerosToponyme, token])

  const onMultipleRemove = useCallback(async numeros => {
    await Promise.all(numeros.map(async numero => {
      try {
        await onRemove(numero)
      } catch (error) {
        setError(error.message)
      }
    }))

    await reloadNumerosToponyme()

    setSelectedNumerosIds([])
    setIsRemoveWarningShown(false)
  }, [reloadNumerosToponyme, onRemove, setSelectedNumerosIds])

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
              Ajouter un numéro
            </Button>
          </Pane>
        )}
      </Pane>

      {isGroupedActionsShown && (
        <GroupedActions
          idVoie={toponyme._id}
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
                  initialToponyme={toponyme}
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
          {editingId && editingId !== toponyme._id ? (
            <Table.Row height='auto'>
              <Table.Cell display='block' paddingY={12} background='tint1'>
                <NumeroEditor
                  initialToponyme={toponyme}
                  initialValue={editedNumero}
                  onSubmit={onEdit}
                  onCancel={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            Object.keys(numerosByVoie).map(nomVoie => (
              <>
                <Table.Cell>
                  <Heading padding='.5em' backgroundColor='white' width='100%'>
                    {nomVoie}
                  </Heading>
                </Table.Cell>
                {numerosByVoie[nomVoie].map(numero => (
                  <TableRow
                    {...numero}
                    key={numero._id}
                    id={numero._id}
                    comment={numero.comment}
                    isSelectable={!isEditing && !numero}
                    label={numero.numero}
                    toponyme={null}
                    secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
                    handleSelect={handleSelect}
                    isSelected={selectedNumerosIds.includes(numero._id)}
                    onEdit={onEnableEditing}
                    onRemove={onRemove}
                  />
                ))}
              </>
            ))
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
