import {useContext} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Pane, Table} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import ToponymeEditor from '@/components/bal/toponyme-editor'

function ToponymesList({toponymes, editedId, onCancel, onSelect, onEnableEditing, setToRemove, hasCadastre}) {
  const {token} = useContext(TokenContext)
  const {isEditing} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(toponymes, 200, {
    keys: [
      'nom'
    ]
  })

  return (
    <Pane flex={1} overflowY='scroll'>
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
        {sortBy(filtered, t => normalizeSort(t.nom))
          .map(toponyme => toponyme._id === editedId ? (
            <Table.Row key={toponyme._id} height='auto'>
              <Table.Cell display='block' padding={0} background='tint1'>
                <ToponymeEditor initialValue={toponyme} closeForm={onCancel} hasCadastre={hasCadastre} />
              </Table.Cell>
            </Table.Row>
          ) : (
            <TableRow
              key={toponyme._id}
              label={toponyme.nom}
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
      </Table>
    </Pane>
  )
}

ToponymesList.propTypes = {
  toponymes: PropTypes.array.isRequired,
  editedId: PropTypes.string,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  hasCadastre: PropTypes.bool.isRequired
}

ToponymesList.defaultProps = {
  editedId: null
}

export default ToponymesList
