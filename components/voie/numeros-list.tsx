import {useState, useCallback, useMemo, useContext} from 'react'
import {sortBy} from 'lodash'
import {Pane, Paragraph, Heading, Button, Table, Checkbox, AddIcon, LockIcon} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'
import {batchNumeros, softRemoveMultipleNumero, softRemoveNumero} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import MapContext from '@/contexts/map'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import DeleteWarning from '@/components/delete-warning'
import GroupedActions from '@/components/grouped-actions'
import InfiniteScrollList from '@/components/infinite-scroll-list'
import BALRecoveryContext from '@/contexts/bal-recovery'
import { Numero, NumeroPopulate } from '@/lib/openapi'

interface NumerosListProps {
  token?: string;
  voieId: string;
  numeros: Array<Numero | NumeroPopulate>;
  handleEditing: (id?: string) => void;
}

function NumerosList({token = null, voieId, numeros, handleEditing}: NumerosListProps) {
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false)
  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])

  const {baseLocale, isEditing, reloadNumeros, reloadParcelles, toponymes, refreshBALSync} = useContext(BalDataContext)
  const {reloadTiles} = useContext(MapContext)
  const {setIsRecoveryDisplayed} = useContext(BALRecoveryContext)

  const [isDisabled, setIsDisabled] = useState(false)

  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: [
      'numeroComplet'
    ]
  })

  const scrollableItems = useMemo(() => (
    sortBy(filtered, n => {
      normalizeSort(n.numeroComplet)
    })
  ), [filtered])

  const isGroupedActionsShown = useMemo(() => (
    token && numeros && selectedNumerosIds.length > 1
  ), [token, numeros, selectedNumerosIds])

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
    await softRemoveNumero(idNumero, token)
    await reloadNumeros()
    await reloadParcelles()
    reloadTiles()
    refreshBALSync()
  }, [reloadNumeros, reloadParcelles, refreshBALSync, token, reloadTiles])

  const onMultipleRemove = async () => {
    setIsDisabled(true)
    await softRemoveMultipleNumero(baseLocale._id, {numerosIds: selectedNumerosIds}, token)

    await reloadNumeros()
    await reloadParcelles()
    reloadTiles()
    refreshBALSync()

    setSelectedNumerosIds([])
    setIsRemoveWarningShown(false)
    setIsDisabled(false)
  }

  const onMultipleEdit = async (balId, body) => {
    await batchNumeros(balId, body, token)

    await reloadNumeros()
    refreshBALSync()
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

        <Pane marginLeft='auto'>
          <Button
            iconBefore={token ? AddIcon : LockIcon}
            appearance='primary'
            intent='success'
            onClick={token ? () => {
              handleEditing()
            } : () => {
              setIsRecoveryDisplayed(true)
            }}
          >Ajouter un numéro</Button>
        </Pane>
      </Pane>

      {isGroupedActionsShown && (
        <GroupedActions
          idVoie={voieId}
          numeros={numeros}
          selectedNumerosIds={selectedNumerosIds}
          resetSelectedNumerosIds={() => {
            setSelectedNumerosIds([])
          }}
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
        onCancel={() => {
          setIsRemoveWarningShown(false)
        }}
        onConfirm={onMultipleRemove}
        isDisabled={isDisabled}
      />

      <Table display='flex' flex={1} flexDirection='column' overflowY='auto'>
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

        {filtered.length === 0 && (
          <Table.Row>
            <Table.TextCell color='muted' fontStyle='italic'>
              Aucun numéro
            </Table.TextCell>
          </Table.Row>
        )}

        <InfiniteScrollList items={scrollableItems}>
          {((numero: Numero | NumeroPopulate) => (
            <TableRow
              key={numero._id}
              label={numero.numeroComplet}
              secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
              complement={getToponymeName(numero.toponyme)}
              handleSelect={filtered.length > 1 ? () => {
                handleSelect(numero._id)
              } : null}
              isSelected={selectedNumerosIds.includes(numero._id)}
              isEditing={isEditing}
              isAdmin={Boolean(token)}
              notifications={{
                certification: numero.certifie ? 'Cette adresse est certifiée par la commune' : null,
                comment: numero.comment,
                warning: numero.positions.some(p => p.type === 'inconnue') ? 'Le type d’une position est inconnu' : null
              }}
              actions={{
                onRemove: async () => onRemove(numero._id),
                onEdit: () => {
                  handleEditing(numero._id)
                }
              }}
              openRecoveryDialog={() => {
                setIsRecoveryDisplayed(true)
              }}
            />
          ))}
        </InfiniteScrollList>
      </Table>
    </>
  )
}

export default NumerosList
