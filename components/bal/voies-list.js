import {useContext} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Pane, Table} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import VoieEditor from '@/components/bal/voie-editor'
import InfiniteScrollList from '../infinite-scroll-list'

function VoiesList({voies, editedId, onEnableEditing, onSelect, onCancel, setToRemove}) {
  const {token} = useContext(TokenContext)
  const {isEditing} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  return (
    <Pane flex={1} overflowY='auto'>
      <Table>
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

        <InfiniteScrollList items={sortBy(filtered, v => normalizeSort(v.nom))}>
          {voie => voie._id === editedId ? (
            <Table.Row key={voie._id} height='auto'>
              <Table.Cell display='block' padding={0} background='tint1'>
                <VoieEditor initialValue={voie} closeForm={onCancel} />
              </Table.Cell>
            </Table.Row>
          ) : (
            <TableRow
              key={voie._id}
              label={voie.nom}
              nomAlt={voie.nomAlt}
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
    </Pane>
  )
}

VoiesList.propTypes = {
  voies: PropTypes.array.isRequired,
  editedId: PropTypes.string,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

VoiesList.defaultProps = {
  editedId: null
}

export default VoiesList
