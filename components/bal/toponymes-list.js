import {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Pane, Spinner, Table} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'
import useInfiniteScroll from '@/hooks/infinite-scroll'

import TableRow from '@/components/table-row'
import ToponymeEditor from '@/components/bal/toponyme-editor'

function ToponymesList({toponymes, editedId, commune, onCancel, onSelect, onEnableEditing, setToRemove}) {
  const {token} = useContext(TokenContext)
  const {isEditing} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(toponymes, 200, {
    keys: [
      'nom'
    ]
  })
  const [list, handleScroll, setItems, limit] = useInfiniteScroll(filtered, 15)

  useEffect(() => {
    setItems(filtered)
  }, [filtered, setItems])

  return (
    <Pane flex={1} overflowY='scroll' onScroll={handleScroll}>
      <Table>
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
        {sortBy(list, t => normalizeSort(t.nom))
          .map(toponyme => toponyme._id === editedId ? (
            <Table.Row key={toponyme._id} height='auto'>
              <Table.Cell display='block' padding={0} background='tint1'>
                <ToponymeEditor initialValue={toponyme} commune={commune} closeForm={onCancel} />
              </Table.Cell>
            </Table.Row>
          ) : (
            <TableRow
              key={toponyme._id}
              label={toponyme.nom}
              nomAlt={toponyme.nomAlt}
              isEditingEnabled={Boolean(!isEditing && token)}
              notifications={{
                warning: toponyme.positions.length === 0 ? 'Ce toponyme n’a pas de position' : null
              }}
              actions={{
                onSelect: () => onSelect(toponyme._id),
                onEdit: () => onEnableEditing(toponyme._id),
                onRemove: () => setToRemove(toponyme._id)
              }}
            />
          ))}

        {limit < filtered.length && (
          <Pane display='flex' justifyContent='center' marginY={16}><Spinner /></Pane>
        )}
      </Table>
    </Pane>
  )
}

ToponymesList.propTypes = {
  toponymes: PropTypes.array.isRequired,
  editedId: PropTypes.string,
  commune: PropTypes.object.isRequired,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

ToponymesList.defaultProps = {
  editedId: null
}

export default ToponymesList
