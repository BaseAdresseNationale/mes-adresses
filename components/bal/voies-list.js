import {useContext, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Table, KeyTabIcon, Paragraph, Pane} from 'evergreen-ui'
import {useRouter} from 'next/router'

import {normalizeSort} from '@/lib/normalize'
import {softRemoveVoie} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import CommentsContent from '@/components/comments-content'
import DeleteWarning from '@/components/delete-warning'

import InfiniteScrollList from '../infinite-scroll-list'

function VoiesList({voies, onEnableEditing, setToConvert, balId, onRemove, addButton}) {
  const {token} = useContext(TokenContext)
  const [toRemove, setToRemove] = useState(null)
  const {isEditing, reloadVoies} = useContext(BalDataContext)
  const [isDisabled, setIsDisabled] = useState(false)
  const router = useRouter()

  const handleRemove = async () => {
    setIsDisabled(true)
    await softRemoveVoie(toRemove, token)
    await reloadVoies()
    await onRemove()
    setToRemove(null)
    setIsDisabled(false)
  }

  const onSelect = id => {
    router.push(`/bal/${balId}/voies/${id}`)
  }

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  const scrollableItems = useMemo(() => (
    sortBy(filtered, v => normalizeSort(v.nom))
  ), [filtered])

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={(
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer cette voie ainsi que tous ses numéros ?
          </Paragraph>
        )}
        onCancel={() => setToRemove(null)}
        onConfirm={handleRemove}
        isDisabled={isDisabled}
      />
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor='white'
        paddingX={16}
        display='flex'
        alignItems='center'
        minHeight={50}
      >
        {addButton}
      </Pane>
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
    </>
  )
}

VoiesList.propTypes = {
  voies: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  balId: PropTypes.string.isRequired,
  setToConvert: PropTypes.func.isRequired,
  addButton: PropTypes.object
}

export default VoiesList
