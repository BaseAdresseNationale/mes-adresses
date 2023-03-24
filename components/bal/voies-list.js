import {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Table, KeyTabIcon} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import CommentsContent from '@/components/comments-content'

import InfiniteScrollList from '../infinite-scroll-list'

function VoiesList({voies, onEnableEditing, onSelect, setToRemove, setToConvert}) {
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
            isEditingEnabled={Boolean(!isEditing && token)}
            actions={{
              onSelect: () => onSelect(voie._id),
              onEdit: () => onEnableEditing(voie._id),
              onRemove: () => setToRemove(voie._id),
              extra: voie.nbNumeros === 0 ? {
                callback: () => setToConvert(voie._id),
                icon: KeyTabIcon,
                text: 'Convertir en toponyme',
              } : null
            }}
            notifications={{
              certification: voie.isAllCertified ? 'Toutes les adresses de cette voie sont certifiées par la commune' : null,
              comment: voie.commentedNumeros.length > 0 ? <CommentsContent comments={voie.commentedNumeros} /> : null,
              warning: voie.nbNumeros === 0 ? 'Cette voie ne contient aucun numéro' : null
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
  onSelect: PropTypes.func.isRequired,
  setToConvert: PropTypes.func.isRequired
}

export default VoiesList
