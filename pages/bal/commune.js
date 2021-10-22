import React, {useState, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Heading, Text, Paragraph, Button, AddIcon} from 'evergreen-ui'

import {getVoies, addVoie, populateCommune, editVoie, removeVoie, addToponyme, editToponyme, removeToponyme} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useHelp from '../../hooks/help'

import DeleteWarning from '../../components/delete-warning'
import VoiesList from '../../components/bal/voies-list'
import ToponymesList from '../../components/bal/toponymes-list'

const Commune = React.memo(({baseLocale, commune, defaultVoies}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isPopulating, setIsPopulating] = useState(false)
  const [toRemove, setToRemove] = useState(null)
  const [selectedTab, setSelectedTab] = useState('voie')

  const {token} = useContext(TokenContext)

  const {
    voies,
    toponymes,
    reloadVoies,
    reloadToponymes,
    reloadGeojson,
    editingId,
    setEditingId,
    isEditing,
    setIsEditing
  } = useContext(BalDataContext)

  useHelp(selectedTab === 'voie' ? 2 : 3)

  const onPopulate = useCallback(async () => {
    setIsPopulating(true)

    await populateCommune(baseLocale._id, commune.code, token)
    await reloadVoies()

    setIsPopulating(false)
  }, [baseLocale._id, commune, reloadVoies, token])

  const onAdd = useCallback(async ({nom, positions, typeNumerotation, trace, parcelles}) => {
    if (selectedTab === 'voie') {
      await addVoie(baseLocale._id, commune.code, {
        nom,
        typeNumerotation,
        trace
      }, token)

      await reloadVoies()

      if (trace) {
        await reloadGeojson()
      }
    } else {
      await addToponyme(baseLocale._id, commune.code, {
        nom,
        positions,
        parcelles
      }, token)

      await reloadToponymes()
    }

    setIsAdding(false)
  }, [baseLocale._id, commune, reloadVoies, token, selectedTab, reloadToponymes, reloadGeojson])

  const onEnableEditing = useCallback(async id => {
    setIsAdding(false)
    setEditingId(id)
  }, [setEditingId])

  const onEdit = useCallback(async ({nom, typeNumerotation, trace, positions, parcelles}) => {
    if (selectedTab === 'voie') {
      await editVoie(editingId, {
        nom,
        typeNumerotation,
        trace
      }, token)

      await reloadVoies()
      await reloadGeojson()
    } else {
      await editToponyme(editingId, {
        nom,
        positions,
        parcelles
      }, token)

      await reloadToponymes()
    }

    setEditingId(null)
  }, [editingId, setEditingId, reloadVoies, reloadToponymes, reloadGeojson, selectedTab, token])

  const onRemove = useCallback(async () => {
    if (selectedTab === 'voie') {
      await removeVoie(toRemove, token)
      await reloadVoies()
    } else {
      await removeToponyme(toRemove, token)
      await reloadToponymes()
    }

    await reloadGeojson()
    setToRemove(null)
  }, [reloadVoies, reloadToponymes, reloadGeojson, selectedTab, toRemove, token])

  const onCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
  }, [setEditingId])

  const onSelect = useCallback(id => {
    if (editingId || isAdding) {
      onCancel()
    }

    if (selectedTab === 'voie') {
      Router.push(
        `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&idVoie=${id}`,
        `/bal/${baseLocale._id}/communes/${commune.code}/voies/${id}`
      )
    } else {
      Router.push(
        `/bal/toponyme?balId=${baseLocale._id}&codeCommune=${commune.code}&idToponyme=${id}`,
        `/bal/${baseLocale._id}/communes/${commune.code}/toponymes/${id}`
      )
    }
  }, [baseLocale._id, editingId, isAdding, commune, selectedTab, onCancel])

  useEffect(() => {
    setIsEditing(isAdding)
  }, [isAdding, setIsEditing])

  useEffect(() => {
    if (editingId && toponymes.find(toponyme => toponyme._id === editingId)) {
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
        background='gray100'
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
              disabled={isAdding || isPopulating || Boolean(editingId) || isEditing}
              onClick={() => setIsAdding(true)}
            >
              Ajouter {selectedTab === 'voie' ? 'une voie' : 'un toponyme'}
            </Button>
          </Pane>
        )}
      </Pane>

      {selectedTab === 'voie' ? (
        <VoiesList
          defaultVoies={defaultVoies}
          isPopulating={isPopulating}
          isAdding={isAdding}
          setToRemove={setToRemove}
          onEnableEditing={onEnableEditing}
          onSelect={onSelect}
          onCancel={onCancel}
          onAdd={onAdd}
          onEdit={onEdit}
        />
      ) : (
        <ToponymesList
          isPopulating={isPopulating}
          isAdding={isAdding}
          setToRemove={setToRemove}
          onEnableEditing={onEnableEditing}
          onSelect={onSelect}
          onCancel={onCancel}
          onAdd={onAdd}
          onEdit={onEdit}
        />
      )}

      {token && voies && voies.length === 0 && (
        <Pane borderTop marginTop='auto' padding={16}>
          <Paragraph size={300} color='muted'>
            Vous souhaitez importer les voies de la commune de {commune.nom} depuis la Base Adresse Nationale ?
          </Paragraph>
          <Button marginTop={10} appearance='primary' disabled={isAdding || isPopulating} onClick={onPopulate}>
            Importer les données de la BAN
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

Commune.getInitialProps = async ({baseLocale, commune}) => {
  const defaultVoies = await getVoies(baseLocale._id, commune.code)

  return {
    layout: 'sidebar',
    baseLocale,
    commune,
    defaultVoies
  }
}

Commune.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  defaultVoies: PropTypes.array
}

Commune.defaultProps = {
  defaultVoies: null
}

export default Commune
