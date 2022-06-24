import React, {useState, useCallback, useContext, useEffect} from 'react'
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
  const [editedId, setEditedId] = useState(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
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
    editingId,
    isEditing,
    setIsEditing,
    isDeleted
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

    await reloadGeojson()
    refreshBALSync()
    setToRemove(null)
  }, [reloadVoies, refreshBALSync, reloadToponymes, reloadGeojson, selectedTab, toRemove, token])

  const onSelect = useCallback(id => {
    if (editingId) {
      setEditedId(null)
    }

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
  }, [baseLocale._id, router, editingId, selectedTab])

  useEffect(() => {
    setEditedId(null)
    setIsCreateFormOpen(false)
  }, [selectedTab])

  useEffect(() => {
    if (editingId && toponymes.some(toponyme => toponyme._id === editingId)) {
      setSelectedTab('toponyme')
    }
  }, [toponymes, editingId])

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

      {isCreateFormOpen && !editingId ? (
        <Pane>
          {selectedTab === 'voie' ? (
            <VoieEditor closeForm={() => setIsCreateFormOpen(false)} />
          ) : (
            <ToponymeEditor commune={commune} closeForm={() => setIsCreateFormOpen(false)} />
          )}
        </Pane>
      ) : (
        <Pane
          flexShrink={0}
          elevation={0}
          backgroundColor='white'
          paddingX={16}
          display='flex'
          alignItems='center'
          minHeight={50}
        >
          {token && !isDeleted && (
            <Pane marginLeft='auto'>
              <Button
                iconBefore={AddIcon}
                appearance='primary'
                intent='success'
                disabled={isEditing}
                onClick={() => setIsCreateFormOpen(true)}
              >
                Ajouter {selectedTab === 'voie' ? 'une voie' : 'un toponyme'}
              </Button>
            </Pane>
          )}
        </Pane>
      )}

      {selectedTab === 'voie' ? (
        <VoiesList
          voies={voies}
          editedId={editedId}
          setToRemove={setToRemove}
          onEnableEditing={setEditedId}
          onSelect={onSelect}
          onCancel={() => setEditedId(null)}
        />
      ) : (
        <ToponymesList
          toponymes={toponymes}
          editedId={editedId}
          commune={commune}
          setToRemove={setToRemove}
          onEnableEditing={setEditedId}
          onSelect={onSelect}
          onCancel={() => setEditedId(null)}
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
