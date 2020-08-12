import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {sortBy} from 'lodash'
import {Pane, Heading, Text, Paragraph, Table, Button} from 'evergreen-ui'

import {getVoies, addVoie, populateCommune, editVoie, removeVoie} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import useFuse from '../../hooks/fuse'
import useHelp from '../../hooks/help'

import DeleteWarning from '../../components/delete-warning'
import TableRow from '../../components/table-row'
import VoieEditor from '../../components/bal/voie-editor'
import {normalizeSort} from '../../lib/normalize'
import {getFullVoieName} from '../../lib/voie'

const Commune = React.memo(({commune, defaultVoies}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isPopulating, setIsPopulating] = useState(false)
  const [toRemove, setToRemove] = useState(null)

  const {token} = useContext(TokenContext)
  const {baseLocale} = useContext(BalDataContext)

  const {
    voies,
    reloadVoies,
    editingId,
    setEditingId
  } = useContext(BalDataContext)

  useHelp(2)
  const [filtered, setFilter] = useFuse(voies || defaultVoies, 200, {
    keys: [
      'nom'
    ]
  })

  const onPopulate = useCallback(async () => {
    setIsPopulating(true)

    await populateCommune(baseLocale._id, commune.code, token)
    await reloadVoies()

    setIsPopulating(false)
  }, [baseLocale, commune, reloadVoies, token])

  const onAdd = useCallback(async ({nom, positions, complement}) => {
    await addVoie(baseLocale._id, commune.code, {
      nom,
      positions,
      complement
    }, token)

    await reloadVoies()

    setIsAdding(false)
  }, [baseLocale, commune, reloadVoies, token])

  const onEnableAdding = useCallback(() => {
    setIsAdding(true)
  }, [])

  const onEnableEditing = useCallback(idVoie => {
    setIsAdding(false)
    setEditingId(idVoie)
  }, [setEditingId])

  const onEdit = useCallback(async ({nom, positions, complement}) => {
    await editVoie(editingId, {
      nom,
      positions,
      complement
    }, token)

    await reloadVoies()

    setEditingId(null)
  }, [editingId, setEditingId, reloadVoies, token])

  const onRemove = useCallback(async () => {
    await removeVoie(toRemove, token)
    await reloadVoies()
    setToRemove(null)
  }, [reloadVoies, toRemove, token])

  const onSelect = useCallback(idVoie => {
    Router.push(
      `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&idVoie=${idVoie}`,
      `/bal/${baseLocale._id}/communes/${commune.code}/voies/${idVoie}`
    )
  }, [baseLocale, commune])

  const onCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
  }, [setEditingId])

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
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane>
          <Heading>Liste des voies</Heading>
        </Pane>
        {token && (
          <Pane marginLeft='auto'>
            <Button
              iconBefore='add'
              appearance='primary'
              intent='success'
              disabled={isAdding || isPopulating || Boolean(editingId)}
              onClick={onEnableAdding}
            >
              Ajouter une voie
            </Button>
          </Pane>
        )}
      </Pane>

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
                  isEnabledComplement={Boolean(baseLocale.enableComplement)}
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
                    isEnabledComplement={Boolean(baseLocale.enableComplement)}
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
                isSelectable={!isAdding && !isPopulating && !editingId && voie.positions.length === 0}
                label={getFullVoieName(voie, baseLocale.enableComplement)}
                secondary={voie.positions.length === 1 ? 'Toponyme' : null}
                onSelect={onSelect}
                onEdit={onEnableEditing}
                onRemove={id => setToRemove(id)}
              />
            ))}
        </Table>
      </Pane>
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
