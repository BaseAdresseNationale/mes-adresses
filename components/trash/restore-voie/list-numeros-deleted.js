import {useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Pane, Heading, Table, Checkbox} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import useFuse from '@/hooks/fuse'

import InfiniteScrollList from '@/components/infinite-scroll-list'
import RowNumeroDeleted from '@/components/trash/restore-voie/row-numero-deleted'

function ListNumerosDeleted({numeros, selectedNumerosIds, setSelectedNumerosIds}) {
  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: [
      'numero'
    ]
  })

  const scrollableItems = useMemo(() => (
    sortBy(filtered, n => {
      normalizeSort(String(n.numero))
    })
  ), [filtered])

  const noFilter = numeros && filtered.length === numeros.length

  const isAllSelected = useMemo(() => {
    const isAllNumerosSelected = noFilter && (selectedNumerosIds.length === numeros.length)
    const isAllFilteredNumerosSelected = !noFilter && (filtered.length === selectedNumerosIds.length) && filtered.length > 0

    return isAllNumerosSelected || isAllFilteredNumerosSelected
  }, [numeros, noFilter, selectedNumerosIds, filtered])

  const handleSelect = useCallback(id => {
    setSelectedNumerosIds(selectedNumero => {
      if (selectedNumero.includes(id)) {
        return selectedNumerosIds.filter(f => f !== id)
      }

      return [...selectedNumerosIds, id]
    })
  }, [selectedNumerosIds, setSelectedNumerosIds])

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNumerosIds([])
    } else {
      setSelectedNumerosIds(filtered.map(({_id}) => _id))
    }
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
          <Heading>Liste des numéros supprimés</Heading>
        </Pane>
      </Pane>

      <Table display='flex' flex={1} flexDirection='column' overflowY='auto'>
        <Table.Head>
          {numeros && (
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
          {(numero => (
            <RowNumeroDeleted
              key={String(numero._id)}
              label={String(numero.numero)}
              secondary={numero.positions.length > 1 ? `${numero.positions.length} positions` : null}
              handleSelect={() => handleSelect(numero._id)}
              isSelected={selectedNumerosIds.includes(numero._id)}
            />
          ))}
        </InfiniteScrollList>
      </Table>
    </>
  )
}

ListNumerosDeleted.propTypes = {
  numeros: PropTypes.array.isRequired,
  selectedNumerosIds: PropTypes.array.isRequired,
  setSelectedNumerosIds: PropTypes.func.isRequired
}

export default ListNumerosDeleted
