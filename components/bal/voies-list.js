import {useContext} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

import {Pane, Table} from 'evergreen-ui'

import BalDataContext from '../../contexts/bal-data'

import useFuse from '../../hooks/fuse'

import {normalizeSort} from '../../lib/normalize'
import TableRow from '../table-row'
import VoieEditor from './voie-editor'

function VoiesList({defaultVoies, onEnableEditing, isAdding, onSelect, isPopulating, onAdd, onEdit, onCancel, setToRemove}) {
  const {
    isEditing,
    editingId,
    voies,
  } = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(voies || defaultVoies, 200, {
    keys: [
      'nom',
    ],
  })

  return (
    <Pane flex={1} overflowY='scroll'>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            placeholder='Rechercher une voie'
            onChange={setFilter}
          />
        </Table.Head>
        {isAdding && (
          <Table.Row height='auto'>
            <Table.Cell borderBottom display='block' paddingY={12} background='tint1'>
              <VoieEditor
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
        {sortBy(filtered, v => normalizeSort(v.nom))
          .map(voie => voie._id === editingId ? (
            <Table.Row key={voie._id} height='auto'>
              <Table.Cell display='block' paddingY={12} background='tint1'>
                <VoieEditor
                  initialValue={voie}
                  onSubmit={onEdit}
                  onCancel={onCancel}
                />
              </Table.Cell>
            </Table.Row>
          ) : (
            <TableRow
              key={voie._id}
              id={voie._id}
              isSelectable={!isEditing && !isPopulating}
              label={voie.nom}
              onSelect={onSelect}
              onEdit={onEnableEditing}
              onRemove={id => setToRemove(id)}
            />
          ))}
      </Table>
    </Pane>
  )
}

VoiesList.propTypes = {
  defaultVoies: PropTypes.array,
  isPopulating: PropTypes.bool,
  isAdding: PropTypes.bool.isRequired,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}

VoiesList.defaultProps = {
  defaultVoies: null,
  isPopulating: false,
}

export default VoiesList
