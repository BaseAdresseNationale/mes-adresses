import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Text, Paragraph, Button, AddIcon, Tablist, Tab} from 'evergreen-ui'

import {populateCommune, convertVoieToToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'

import ConvertVoieWarning from '@/components/convert-voie-warning'
import VoiesList from '@/components/bal/voies-list'
import VoieEditor from '@/components/bal/voie-editor'
import ToponymesList from '@/components/bal/toponymes-list'
import ToponymeEditor from '@/components/bal/toponyme-editor'
import CommuneTab from '@/components/bal/commune-tab'

const TABS = ['Commune', 'Voies', 'Toponymes']

const BaseLocale = React.memo(({baseLocale, commune}) => {
  const [editedItem, setEditedItem] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toConvert, setToConvert] = useState(null)
  const [onConvertLoading, setOnConvertLoading] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(1)

  const {token} = useContext(TokenContext)

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

  useHelp(selectedTabIndex)

  const onPopulate = useCallback(async () => {
    setIsEditing(true)

    await populateCommune(baseLocale._id, token)
    await reloadVoies()

    setIsEditing(false)
  }, [baseLocale._id, reloadVoies, setIsEditing, token])

  const onRemove = useCallback(async () => {
    await reloadParcelles()
    await reloadGeojson()
    refreshBALSync()
  }, [refreshBALSync, reloadGeojson, reloadParcelles])

  const onConvert = useCallback(async () => {
    setOnConvertLoading(true)
    const res = await convertVoieToToponyme(toConvert, token)
    if (!res.error) {
      await reloadVoies()
      await reloadToponymes()
      await reloadParcelles()
      await reloadGeojson()
      refreshBALSync()
      setOnConvertLoading(false)
      // Select the tab topnyme after conversion
      setSelectedTabIndex(2)
      setEditedItem(res)
      setIsFormOpen(true)
    }

    setToConvert(null)
  }, [reloadVoies, refreshBALSync, reloadToponymes, reloadGeojson, reloadParcelles, toConvert, token])

  const onEdit = useCallback(id => {
    if (id) {
      setEditedItem([...voies, ...toponymes].find(({_id}) => _id === id))
      setIsFormOpen(true)
    } else {
      setEditedItem(null)
      setIsFormOpen(false)
    }
  }, [voies, toponymes])

  const displayTabContent = () => {
    switch (selectedTabIndex) {
      case 1:
        return (
          <VoiesList
            voies={voies}
            balId={baseLocale._id}
            onEnableEditing={onEdit}
            setToConvert={setToConvert}
            onRemove={onRemove}
            addButton={token && <Pane marginLeft='auto'>
              <Button
                iconBefore={AddIcon}
                appearance='primary'
                intent='success'
                disabled={isEditing}
                onClick={() => setIsFormOpen(true)}
              >
                Ajouter une voie
              </Button>
            </Pane>}
          />
        )
      case 2:
        return (
          <ToponymesList
            toponymes={toponymes}
            balId={baseLocale._id}
            onEnableEditing={onEdit}
            onRemove={onRemove}
            addButton={token && <Pane marginLeft='auto'>
              <Button
                iconBefore={AddIcon}
                appearance='primary'
                intent='success'
                disabled={isEditing}
                onClick={() => setIsFormOpen(true)}
              >
                Ajouter un toponyme
              </Button>
            </Pane>}
          />
        )
      default:
        return <CommuneTab commune={commune} />
    }
  }

  return (
    <>
      <ConvertVoieWarning
        isShown={Boolean(toConvert)}
        content={(
          <Paragraph>
            Êtes vous bien sûr de vouloir convertir cette voie en toponyme ?
          </Paragraph>
        )}
        isLoading={onConvertLoading}
        onCancel={() => setToConvert(null)}
        onConfirm={onConvert}
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

      <Pane position='relative' display='flex' flexDirection='column' height='100%' width='100%' overflow='hidden'>
        {isFormOpen && selectedTabIndex === 1 && <VoieEditor initialValue={editedItem} closeForm={() => onEdit(null)} />}
        {isFormOpen && selectedTabIndex === 2 && <ToponymeEditor initialValue={editedItem} commune={commune} closeForm={() => onEdit(null)} />}

        <Pane
          flexShrink={0}
          elevation={0}
          width='100%'
          display='flex'
          padding={10}
        >
          <Tablist>
            {TABS.map(
              (tab, index) => (
                <Tab
                  key={tab}
                  isSelected={selectedTabIndex === index}
                  onSelect={() => setSelectedTabIndex(index)}
                >
                  {tab}
                </Tab>
              )
            )}
          </Tablist>
        </Pane>

        {displayTabContent()}

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
      </Pane>

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
