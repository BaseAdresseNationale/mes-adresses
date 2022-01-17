import {useContext} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

import {Pane, Table} from 'evergreen-ui'

import BalDataContext from '../../contexts/bal-data'

import useFuse from '../../hooks/fuse'

import {normalizeSort} from '../../lib/normalize'
import TableRow from '../table-row'
import ToponymeEditor from './toponyme-editor'

function ToponymesList({isAdding, onAdd, onEdit, onCancel, onSelect, onEnableEditing, isPopulating, setToRemove}) {
  const {
    isEditing,
    editingId,
    toponymes
  } = useContext(BalDataContext)

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
        {isAdding && (
          <Table.Row height='auto'>
            <Table.Cell borderBottom display='block' padding={0} background='tint1'>
              <ToponymeEditor
                onSubmit={onAdd}
                onCancel={onCancel}
              />
            </Table.Cell>
          </Table.Row>
        )}
        {filtered.length === 0 && (
          <Table.Row>
            <Table.TextCell color='muted' fontStyle='italic'>
              Aucun résultat
            </Table.TextCell>
          </Table.Row>
        )}
        {sortBy(filtered, t => normalizeSort(t.nom))
          .map(toponyme => toponyme._id === editingId ? (
            <Table.Row key={toponyme._id} height='auto'>
              <Table.Cell display='block' padding={0} background='tint1'>
                <ToponymeEditor
                  initialValue={toponyme}
                  onSubmit={onEdit}
                  onCancel={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            <TableRow
              key={toponyme._id}
              id={toponyme._id}
              warning={toponyme.positions.length === 0 ? 'Ce toponyme n’a pas de position' : null}
              isSelectable={!isEditing && !isPopulating}
              label={toponyme.nom}
              onSelect={onSelect}
              onEdit={onEnableEditing}
              onRemove={id => setToRemove(id)}
            />
          ))}
      </Table>
    </Pane>
  )
}

ToponymesList.propTypes = {
  isPopulating: PropTypes.bool,
  isAdding: PropTypes.bool.isRequired,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
}

ToponymesList.defaultProps = {
  isPopulating: false
}

export default ToponymesList
