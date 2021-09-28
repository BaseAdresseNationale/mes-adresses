import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Paragraph, Heading, Table, Button, Checkbox, Alert, AddIcon} from 'evergreen-ui'

import {addNumero, editNumero, removeNumero, getNumeros, addVoie} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'
import useFuse from '../../hooks/fuse'

import TableRow from '../../components/table-row'
import NumeroEditor from '../../components/bal/numero-editor'
import DeleteWarning from '../../components/delete-warning'
import GroupedActions from '../../components/grouped-actions'

import VoieHeading from './voie-heading'

const Voie = React.memo(({voie, defaultNumeros}) => {
  const [isEdited, setEdited] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState()
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false)

  const {token} = useContext(TokenContext)

  const {
    baseLocale,
    codeCommune,
    numeros,
    reloadNumeros,
    editingId,
    setEditingId,
    isEditing,
    setIsEditing
  } = useContext(BalDataContext)

  useHelp(4)
  const [filtered, setFilter] = useFuse(numeros || defaultNumeros, 200, {
    keys: [
      'numeroComplet'
    ]
  })

  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])
  const [isAllSelectedCertifie, setIsAllSelectedCertifie] = useState(false)

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

  const onAdd = useCallback(async (voieData, body) => {
    let editedVoie = voieData
    if (!editedVoie._id) {
      editedVoie = await addVoie(baseLocale._id, codeCommune, editedVoie, token)
    }

    await addNumero(editedVoie._id, body, token)

    await reloadNumeros()

    setIsAdding(false)
  }, [baseLocale, codeCommune, reloadNumeros, token])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEnableEditing = useCallback(idNumero => {
    setIsAdding(false)
    setEditingId(idNumero)
  }, [setEditingId])

  const onEdit = useCallback(async (voieData, body) => {
    let editedVoie = voieData
    if (!editedVoie._id) {
      editedVoie = await addVoie(baseLocale._id, codeCommune, editedVoie, token)
    }

    await editNumero(editingId, {...body, voie: editedVoie._id}, token)

    await reloadNumeros()

    setEditingId(null)
  }, [editingId, baseLocale, codeCommune, setEditingId, reloadNumeros, token])

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
    setIsEditing(isAdding)
  }, [isAdding, setIsEditing])

  useEffect(() => {
    const filteredNumeros = numeros?.filter(numero => selectedNumerosIds.includes(numero._id))
    const filteredCertifieNumeros = filteredNumeros?.filter(numero => numero.certifie)
    setIsAllSelectedCertifie(filteredCertifieNumeros?.length === selectedNumerosIds.length)
  }, [numeros, selectedNumerosIds])

  return (
    <>
      <VoieHeading defaultVoie={voie} />

      {!isEditing && (
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
      )}

      {isGroupedActionsShown && numeros && (
        <GroupedActions
          idVoie={voie._id}
          numeros={numeros}
          selectedNumerosIds={toEdit}
          resetSelectedNumerosIds={() => setSelectedNumerosIds([])}
          setIsRemoveWarningShown={setIsRemoveWarningShown}
          isAllSelectedCertifie={isAllSelectedCertifie}
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
          {!isEditing && (
            <Table.Head>
              {numeros && token && filtered.length > 1 && (
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
          )}

          {isAdding && (
            <Table.Row height='auto'>
              <Table.Cell borderBottom display='block' paddingY={12} background='tint1'>
                <NumeroEditor
                  initialVoieId={voie._id}
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
                  initialVoieId={voie._id}
                  initialValue={editedNumero}
                  onSubmit={onEdit}
                  onCancel={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            !isEditing && (
              filtered.map(numero => (
                <TableRow
                  {...numero}
                  key={numero._id}
                  id={numero._id}
                  isCertified={numero.certifie}
                  comment={numero.comment}
                  warning={numero.positions.find(p => p.type === 'inconnue') ? 'Le type d’une position est inconnu' : null}
                  isSelectable={!isEditing}
                  label={numero.numeroComplet}
                  secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
                  toponymeId={numero.toponyme}
                  handleSelect={handleSelect}
                  isSelected={selectedNumerosIds.includes(numero._id)}
                  onEdit={onEnableEditing}
                  onRemove={onRemove}
                />
              ))
            )
          )}
        </Table>
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
    nom: PropTypes.string.isRequired
  }).isRequired,
  defaultNumeros: PropTypes.array
}

Voie.defaultProps = {
  defaultNumeros: null
}

export default Voie
