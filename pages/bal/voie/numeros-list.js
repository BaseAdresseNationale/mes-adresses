import React, {useState, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Paragraph, Heading, Button, Table, Checkbox, Alert, AddIcon} from 'evergreen-ui'

import {editNumero, removeNumero} from '../../../lib/bal-api'

import TableRow from '../../../components/table-row'
import DeleteWarning from '../../../components/delete-warning'
import GroupedActions from '../../../components/grouped-actions'

import BalDataContext from '../../../contexts/bal-data'

import useFuse from '../../../hooks/fuse'

function NumerosList({token, voieId, defaultNumeros, disabledEdition, handleEditing}) {
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false)
  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])
  const [error, setError] = useState(null)

  const {numeros, reloadNumeros} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(numeros || defaultNumeros, 200, {
    keys: [
      'numeroComplet'
    ]
  })

  const isGroupedActionsShown = useMemo(() => (
    token && !disabledEdition && numeros && selectedNumerosIds.length > 1
  ), [token, disabledEdition, numeros, selectedNumerosIds])

  const noFilter = numeros && filtered.length === numeros.length

  const isAllSelected = useMemo(() => {
    const isAllNumerosSelected = noFilter && (selectedNumerosIds.length === numeros.length)
    const isAllFilteredNumerosSelected = !noFilter && (filtered.length === selectedNumerosIds.length)

    return isAllNumerosSelected || isAllFilteredNumerosSelected
  }, [numeros, noFilter, selectedNumerosIds, filtered])

  const isAllSelectedCertifie = useMemo(() => {
    const filteredNumeros = numeros?.filter(numero => selectedNumerosIds.includes(numero._id))
    const filteredCertifieNumeros = filteredNumeros?.filter(numero => numero.certifie)

    return filteredCertifieNumeros?.length === selectedNumerosIds.length
  }, [numeros, selectedNumerosIds])

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

  const onRemove = async idNumero => {
    await removeNumero(idNumero, token)
    await reloadNumeros()
  }

  const onMultipleRemove = async () => {
    await Promise.all(selectedNumerosIds.map(async id => {
      try {
        await onRemove(id)
      } catch (error) {
        setError(error.message)
      }
    }))

    await reloadNumeros()

    setSelectedNumerosIds([])
    setIsRemoveWarningShown(false)
  }

  const onMultipleEdit = async body => {
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
  }

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

        {token && (
          <Pane marginLeft='auto'>
            <Button
              iconBefore={AddIcon}
              appearance='primary'
              intent='success'
              disabled={disabledEdition}
              onClick={handleEditing}
            >Ajouter un numéro</Button>
          </Pane>
        )}
      </Pane>

      {isGroupedActionsShown && (
        <GroupedActions
          idVoie={voieId}
          numeros={numeros}
          selectedNumerosIds={selectedNumerosIds}
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
        onConfirm={onMultipleRemove}
      />

      {error && (
        <Alert marginY={5} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Pane flex={1} overflowY='scroll'>
        <Table>
          <Table.Head>
            {numeros && token && filtered.length > 1 && !disabledEdition && (
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

          {filtered.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun numéro
              </Table.TextCell>
            </Table.Row>
          )}
        </Table>

        {filtered.map(numero => (
          <TableRow
            {...numero}
            key={numero._id}
            id={numero._id}
            isCertified={numero.certifie}
            comment={numero.comment}
            warning={numero.positions.find(p => p.type === 'inconnue') ? 'Le type d’une position est inconnu' : null}
            isSelectable={!disabledEdition}
            label={numero.numeroComplet}
            secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
            toponymeId={numero.toponyme}
            handleSelect={handleSelect}
            isSelected={selectedNumerosIds.includes(numero._id)}
            onEdit={handleEditing}
            onRemove={onRemove}
          />
        ))}
      </Pane>

      {error && (
        <Alert marginY={5} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}
    </>
  )
}

NumerosList.defaultProps = {
  token: null
}

NumerosList.propTypes = {
  token: PropTypes.string,
  voieId: PropTypes.string.isRequired,
  defaultNumeros: PropTypes.array.isRequired,
  disabledEdition: PropTypes.bool.isRequired,
  handleEditing: PropTypes.func.isRequired
}

export default NumerosList