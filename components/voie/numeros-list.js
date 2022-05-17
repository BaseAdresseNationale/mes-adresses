import {useState, useCallback, useMemo, useContext, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {Pane, Paragraph, Heading, Button, Table, Checkbox, AddIcon, Spinner} from 'evergreen-ui'

import {batchNumeros, removeMultipleNumeros, removeNumero} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import DeleteWarning from '@/components/delete-warning'
import GroupedActions from '@/components/grouped-actions'

function NumerosList({token, voieId, numeros, isEditionDisabled, handleEditing}) {
  const [limit, setLimit] = useState(15)
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false)
  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])

  const {baseLocale, isEditing, reloadNumeros, reloadParcelles, reloadGeojson, toponymes, refreshBALSync} = useContext(BalDataContext)

  const needGeojsonUpdateRef = useRef(false)

  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: [
      'numeroComplet'
    ]
  })
  const numeroDisplayed = useMemo(() => {
    return filtered.slice(0, limit)
  }, [filtered, limit])

  const isGroupedActionsShown = useMemo(() => (
    token && !isEditionDisabled && numeros && selectedNumerosIds.length > 1
  ), [token, isEditionDisabled, numeros, selectedNumerosIds])

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

  const getToponymeName = useCallback(toponymeId => {
    if (toponymeId) {
      const toponyme = toponymes.find(({_id}) => _id === toponymeId)
      return toponyme?.nom
    }
  }, [toponymes])

  const handleSelect = useCallback(id => {
    setSelectedNumerosIds(selectedNumero => {
      if (selectedNumero.includes(id)) {
        return selectedNumerosIds.filter(f => f !== id)
      }

      return [...selectedNumerosIds, id]
    })
  }, [selectedNumerosIds])

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNumerosIds([])
    } else {
      setSelectedNumerosIds(filtered.map(({_id}) => _id))
    }
  }

  const onRemove = useCallback(async idNumero => {
    await removeNumero(idNumero, token)
    await reloadNumeros()
    await reloadParcelles()
    needGeojsonUpdateRef.current = true
    refreshBALSync()
  }, [reloadNumeros, reloadParcelles, refreshBALSync, token])

  const onMultipleRemove = async () => {
    await removeMultipleNumeros(baseLocale._id, {numerosIds: selectedNumerosIds}, token)

    await reloadNumeros()
    await reloadParcelles()
    needGeojsonUpdateRef.current = true
    refreshBALSync()

    setSelectedNumerosIds([])
    setIsRemoveWarningShown(false)
  }

  const onMultipleEdit = async (balId, body) => {
    await batchNumeros(balId, body, token)

    await reloadNumeros()
    refreshBALSync()
  }

  const handleScroll = useCallback(({target}) => {
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight

    if (isAtBottom) {
      setLimit(limit => limit + 10)
    }
  }, [])

  useEffect(() => {
    setLimit(15)
  }, [filtered])

  useEffect(() => {
    return () => {
      if (needGeojsonUpdateRef.current) {
        reloadGeojson()
        needGeojsonUpdateRef.current = false
      }
    }
  }, [voieId, reloadGeojson])

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
              disabled={isEditionDisabled}
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

      <Pane flex={1} overflowY='scroll' onScroll={handleScroll}>
        <Table>
          <Table.Head>
            {numeros && token && numeroDisplayed.length > 1 && !isEditionDisabled && (
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

          {numeroDisplayed.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun numéro
              </Table.TextCell>
            </Table.Row>
          )}
        </Table>

        {numeroDisplayed.map(numero => (
          <TableRow
            key={numero._id}
            label={numero.numeroComplet}
            secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
            complement={getToponymeName(numero.toponyme)}
            handleSelect={!isEditionDisabled && filtered.length > 1 ? () => handleSelect(numero._id) : null}
            isSelected={selectedNumerosIds.includes(numero._id)}
            isEditingEnabled={Boolean(!isEditing && token)}
            notifications={{
              isCertified: numero.certifie,
              comment: numero.comment,
              warning: numero.positions.some(p => p.type === 'inconnue') ? 'Le type d’une position est inconnu' : null
            }}
            actions={{
              onRemove: () => onRemove(numero._id),
              onEdit: () => handleEditing(numero._id)
            }}
          />
        ))}

        {numeroDisplayed.length < filtered.length && (
          <Pane display='flex' justifyContent='center' marginY={8}><Spinner /></Pane>
        )}
      </Pane>
    </>
  )
}

NumerosList.defaultProps = {
  token: null
}

NumerosList.propTypes = {
  token: PropTypes.string,
  voieId: PropTypes.string.isRequired,
  numeros: PropTypes.array.isRequired,
  isEditionDisabled: PropTypes.bool.isRequired,
  handleEditing: PropTypes.func.isRequired
}

export default NumerosList
