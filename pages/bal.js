import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Heading, Text, Paragraph, Button, AddIcon} from 'evergreen-ui'

import {populateCommune, removeVoie, removeToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'

import DeleteWarning from '@/components/delete-warning'
import VoiesList from '@/components/bal/voies-list'
import VoieEditor from '@/components/bal/voie-editor'
import ToponymesList from '@/components/bal/toponymes-list'
import ToponymeEditor from '@/components/bal/toponyme-editor'

const BaseLocale = React.memo(({baseLocale, commune}) => {
  const [editedItem, setEditedItem] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toRemove, setToRemove] = useState(null)
  const [selectedTab, setSelectedTab] = useState('voie')

  const {token} = useContext(TokenContext)
  const router = useRouter()

  const {
    voies,
    toponymes,
    refreshBALSync,
    reloadVoies,
    reloadToponymes,
    reloadGeojson,
    reloadParcelles,
    isEditing,
    setIsEditing
  } = useContext(BalDataContext)

  useHelp(selectedTab === 'voie' ? 1 : 2)

  const onPopulate = useCallback(async () => {
    setIsEditing(true)

    await populateCommune(baseLocale._id, token)
    await reloadVoies()

    setIsEditing(false)
  }, [baseLocale._id, reloadVoies, setIsEditing, token])

  const onRemove = useCallback(async () => {
    if (selectedTab === 'voie') {
      await removeVoie(toRemove, token)
      await reloadVoies()
    } else {
      await removeToponyme(toRemove, token)
      await reloadToponymes()
    }

    await reloadParcelles()
    await reloadGeojson()
    refreshBALSync()
    setToRemove(null)
  }, [reloadVoies, refreshBALSync, reloadToponymes, reloadGeojson, reloadParcelles, selectedTab, toRemove, token])

  const onSelect = useCallback(id => {
    if (selectedTab === 'voie') {
      router.push(
        `/bal/voie?balId=${baseLocale._id}&idVoie=${id}`,
        `/bal/${baseLocale._id}/voies/${id}`
      )
    } else {
      router.push(
        `/bal/toponyme?balId=${baseLocale._id}&idToponyme=${id}`,
        `/bal/${baseLocale._id}/toponymes/${id}`
      )
    }
  }, [baseLocale._id, router, selectedTab])

  const onEdit = useCallback(id => {
    if (id) {
      setEditedItem([...voies, ...toponymes].find(({_id}) => _id === id))
      setIsFormOpen(true)
    } else {
      setEditedItem(null)
      setIsFormOpen(false)
    }
  }, [voies, toponymes])

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={(
          <Paragraph>
            {`Êtes vous bien sûr de vouloir supprimer ${selectedTab === 'voie' ? 'cette voie ainsi que tous ses numéros' : 'ce toponyme'} ?`}
          </Paragraph>
        )}
        onCancel={() => setToRemove(null)}
        onConfirm={onRemove}
      />

      <Pane
        display='flex'
        flexDirection='column'
        background='tint1'
        padding={16}
      >
        <Heading>{commune.nom} - {commune.code}</Heading>
        {voies && (
          <Text>{voies.length} voie{voies.length > 1 ? 's' : ''}</Text>
        )}
      </Pane>

      {isFormOpen ? (
        <Pane height='fit-content' overflowY='scroll'>
          {selectedTab === 'voie' ? (
            <VoieEditor initialValue={editedItem} closeForm={() => onEdit(null)} />
          ) : (
            <ToponymeEditor initialValue={editedItem} commune={commune} closeForm={() => onEdit(null)} />
          )}
        </Pane>
      ) : (
        <>
          <Pane
            flexShrink={0}
            elevation={0}
            backgroundColor='white'
            width='100%'
            display='flex'
            justifyContent='space-around'
            height={38}
          >
            <div className={`tab ${selectedTab === 'voie' ? 'selected' : ''}`} onClick={() => setSelectedTab('voie')}>
              <Heading>Liste des voies</Heading>
            </div>
            <div className={`tab ${selectedTab === 'toponyme' ? 'selected' : ''}`} onClick={() => setSelectedTab('toponyme')}>
              <Heading>Liste des toponymes</Heading>
            </div>
          </Pane>

          <Pane
            flexShrink={0}
            elevation={0}
            backgroundColor='white'
            paddingX={16}
            display='flex'
            alignItems='center'
            minHeight={50}
          >
            {token && (
              <Pane marginLeft='auto'>
                <Button
                  iconBefore={AddIcon}
                  appearance='primary'
                  intent='success'
                  disabled={isEditing}
                  onClick={() => setIsFormOpen(true)}
                >
                  Ajouter {selectedTab === 'voie' ? 'une voie' : 'un toponyme'}
                </Button>
              </Pane>
            )}
          </Pane>

          {selectedTab === 'voie' ? (
            <VoiesList
              voies={voies}
              setToRemove={setToRemove}
              onEnableEditing={onEdit}
              onSelect={onSelect}
            />
          ) : (
            <ToponymesList
              toponymes={toponymes}
              commune={commune}
              setToRemove={setToRemove}
              onEnableEditing={onEdit}
              onSelect={onSelect}
            />
          )}

          {token && voies && voies.length === 0 && (
            <Pane borderTop marginTop='auto' padding={16}>
              <Paragraph size={300} color='muted'>
                Vous souhaitez importer les voies de la commune de {commune.nom} depuis la Base Adresse Nationale ?
              </Paragraph>
              <Button
                marginTop={10}
                appearance='primary'
                disabled={isEditing}
                isLoading={isEditing}
                onClick={onPopulate}
              >
                {isEditing ? 'Récupération des adresses…' : 'Récupérer les adresses de la BAN'}
              </Button>
            </Pane>
          )}
        </>
      )}

      <style jsx>{`
        .tab {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: whitesmoke;
        }

        .tab:hover {
          cursor: pointer;
          background: #E4E7EB;
        }

        .tab.selected {
          background: #fff;
        }

        .tab .selected:hover {
          background: #E4E7EB;
        }
      `}</style>
    </>
  )
})

BaseLocale.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired
}

export default BaseLocale
