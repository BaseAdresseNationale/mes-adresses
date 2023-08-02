import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Table, AddIcon, TrashIcon} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import useFuse from '@/hooks/fuse'

import TableRowDeleted from '@/components/trash/table-row-deleted/index'
import InfiniteScrollList from '@/components/infinite-scroll-list'

function ItemsListDelete({itemsDeleted, model, onRestore, onRemove, onRemoveNumeros}) {
  const [filtered, setFilter] = useFuse(itemsDeleted, 200, {keys: ['nom']})

  const scrollableItems = useMemo(() => (
    sortBy(filtered, v => normalizeSort(v.nom))
  ), [filtered])

  const actions = item => {
    const actions = [
      {
        label: 'Restorer ' + (model === 'voie' ? (item._deleted ? 'voie' : 'numero(s)') : 'toponyme'),
        callback: () => onRestore(item),
        icon: AddIcon,
        intent: 'none'
      },
      {
        label: 'Supprimer',
        callback: () => (item._deleted ? onRemove(item) : onRemoveNumeros(item)),
        icon: TrashIcon,
        intent: 'danger'
      }
    ]
    return actions
  }

  const complement = item => {
    if (model === 'voie' && item.numeros) {
      if (item._deleted) {
        return 'voie' + (item.numeros.length > 0 ? ' et ' + item.numeros.length + ' numero(s) supprimée(s)' : '')
      }

      return item.numeros.length > 0 ? item.numeros.length + ' numero(s) supprimée(s)' : ''
    }

    return null
  }

  return (
    <Table display='flex' flex={1} flexDirection='column' overflowY='auto'>
      <Table.Head>
        <Table.SearchHeaderCell
          placeholder={`Rechercher une ${model}`}
          onChange={setFilter}
        />
      </Table.Head>

      {filtered.length === 0 && (
        <Table.Row>
          <Table.TextCell color='muted' fontStyle='italic'>
            Aucun résultat
          </Table.TextCell>
        </Table.Row>
      )}

      <InfiniteScrollList items={scrollableItems}>
        {item => (
          <TableRowDeleted
            key={item._id}
            label={item.nom}
            nomAlt={item.nomAlt}
            complement={complement(item)}
            isDeleted={item._deleted !== null}
            actions={actions(item)}
          />
        )}
      </InfiniteScrollList>
    </Table>
  )
}

ItemsListDelete.propTypes = {
  itemsDeleted: PropTypes.array.isRequired,
  model: PropTypes.string.isRequired,
  onRestore: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveNumeros: PropTypes.func.isRequired
}

export default ItemsListDelete
