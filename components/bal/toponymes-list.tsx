import {useContext, useMemo, useState} from 'react'
import {sortBy} from 'lodash'
import {Table, Paragraph, Pane, Button, AddIcon, LockIcon} from 'evergreen-ui'
import {useRouter} from 'next/router'

import {normalizeSort} from '@/lib/normalize'
import {softRemoveToponyme} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'

import TableRow from '@/components/table-row'
import DeleteWarning from '@/components/delete-warning'
import InfiniteScrollList from '@/components/infinite-scroll-list'
import CommentsContent from '@/components/comments-content'
import { ExtentedToponymeDTO } from '@/lib/openapi'

interface ToponymesListProps {
  toponymes: ExtentedToponymeDTO[];
  onRemove: () => Promise<void>;
  onEnableEditing: (id: string) => void;
  balId: string;
  openRecoveryDialog: () => void;
  openForm: () => void;
}

function ToponymesList({toponymes, onEnableEditing, onRemove, balId, openForm, openRecoveryDialog}: ToponymesListProps) {
  const {token} = useContext(TokenContext)
  const [toRemove, setToRemove] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const {isEditing, reloadToponymes} = useContext(BalDataContext)
  const router = useRouter()

  const handleRemove = async () => {
    setIsDisabled(true)
    await softRemoveToponyme(toRemove, token)
    await reloadToponymes()
    await onRemove()
    setToRemove(null)
    setIsDisabled(false)
  }

  const onSelect = (id: string) => {
    void router.push(`/bal/${balId}/toponymes/${id}`)
  }

  const [filtered, setFilter] = useFuse(toponymes, 200, {
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
            Êtes vous bien sûr de vouloir supprimer ce toponyme ?
          </Paragraph>
        )}
        isDisabled={isDisabled}
        onCancel={() => {
          setToRemove(null)
        }}
        onConfirm={handleRemove}
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
        <Pane marginLeft='auto'>
          <Button
            iconBefore={token ? AddIcon : LockIcon}
            appearance='primary'
            intent='success'
            disabled={token && isEditing}
            onClick={() => {
              if (token) {
                openForm()
              } else {
                openRecoveryDialog()
              }
            }}
          >
            Ajouter un toponyme
          </Button>
        </Pane>
      </Pane>
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
          {(toponyme: ExtentedToponymeDTO) => (
            <TableRow
              key={toponyme._id}
              label={toponyme.nom}
              nomAlt={toponyme.nomAlt}
              isAdmin={Boolean(token)}
              isEditing={Boolean(isEditing)}
              notifications={{
                warning: toponyme.positions.length === 0 ? 'Ce toponyme n’a pas de position' : null,
                comment: toponyme.commentedNumeros.length > 0 ? <CommentsContent comments={toponyme.commentedNumeros} /> : null,
                certification: toponyme.isAllCertified ? 'Toutes les adresses de ce toponyme sont certifiées par la commune' : null
              }}
              actions={{
                onSelect: () => {
                  onSelect(toponyme._id)
                },
                onEdit: () => {
                  onEnableEditing(toponyme._id)
                },
                onRemove: () => {
                  setToRemove(toponyme._id)
                }
              }}
              openRecoveryDialog={openRecoveryDialog}
            />
          )}
        </InfiniteScrollList>
      </Table>
    </>
  )
}

export default ToponymesList
