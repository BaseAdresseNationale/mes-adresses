import {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Table} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import InfiniteScrollList from '../infinite-scroll-list'

function VoiesList({voies, onEnableEditing, onSelect, setToRemove}) {
  const {token} = useContext(TokenContext)
  const {isEditing} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  const scrollableItems = useMemo(() => (
    sortBy(filtered, v => normalizeSort(v.nom))
  ), [filtered])

  return (
    <Table display='flex' flex={1} flexDirection='column' overflowY='auto'>
      <Table.Head>
        <Table.SearchHeaderCell
          placeholder='Rechercher une voie'
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
        {voie => (
          <TableRow
            key={voie._id}
            label={voie.nom}
            nomAlt={voie.nomAlt}
            voieId={voie._id}
            isEditingEnabled={Boolean(!isEditing && token)}
            actions={{
              onSelect: () => onSelect(voie._id),
              onEdit: () => onEnableEditing(voie._id),
              onRemove: () => setToRemove(voie._id)
            }}
          />
        )}
      </InfiniteScrollList>
    </Table>
  )
}

VoiesList.propTypes = {
  voies: PropTypes.array.isRequired,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default VoiesList
