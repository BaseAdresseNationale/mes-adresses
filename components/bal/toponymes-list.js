import {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Table} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import InfiniteScrollList from '@/components/infinite-scroll-list'
import CommentsContent from '@/components/comments-content'

function ToponymesList({toponymes, onSelect, onEnableEditing, setToRemove}) {
  const {token} = useContext(TokenContext)
  const {isEditing} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(toponymes, 200, {
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
          placeholder='Rechercher un toponyme'
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
        {toponyme => (
          <TableRow
            key={toponyme._id}
            label={toponyme.nom}
            nomAlt={toponyme.nomAlt}
            isEditingEnabled={Boolean(!isEditing && token)}
            notifications={{
              warning: toponyme.positions.length === 0 ? 'Ce toponyme n’a pas de position' : null,
              comment: toponyme.commentedNumeros.length > 0 ? <CommentsContent comments={toponyme.commentedNumeros} /> : null,
              certification: toponyme.isAllCertified ? 'Toutes les adresses de ce toponyme sont certifiées par la commune' : null
            }}
            actions={{
              onSelect: () => onSelect(toponyme._id),
              onEdit: () => onEnableEditing(toponyme._id),
              onRemove: () => setToRemove(toponyme._id)
            }}
          />
        )}
      </InfiniteScrollList>
    </Table>
  )
}

ToponymesList.propTypes = {
  toponymes: PropTypes.array.isRequired,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default ToponymesList
