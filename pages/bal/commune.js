import React, {useState, useCallback} from 'react'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Table, Button} from 'evergreen-ui'

import {addVoie, populateCommune, editVoie, getVoies, removeVoie} from '../../lib/bal-api'

import useToken from '../../hooks/token'
import useFuse from '../../hooks/fuse'

import Breadcrumbs from '../../components/breadcrumbs'
import TableRow from '../../components/table-row'
import VoieEditor from '../../components/bal/voie-editor'

const Commune = React.memo(({baseLocale, commune, defaultVoies}) => {
  const [voies, setVoies] = useState(defaultVoies)
  const [isAdding, setIsAdding] = useState(false)
  const [isPopulating, setIsPopulating] = useState(false)
  const token = useToken(baseLocale._id)

  console.log('rendering', baseLocale._id, commune.code, voies.length, isAdding, isPopulating, token)

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  const onPopulate = useCallback(async () => {
    setIsPopulating(true)

    await populateCommune(baseLocale._id, commune.code, token)

    const voies = await getVoies(baseLocale._id, commune.code)

    setIsPopulating(false)
    setVoies(voies)
  }, [baseLocale, commune, token])

  const onAdd = useCallback(async ({nom, positions}) => {
    await addVoie(baseLocale._id, commune.code, {
      nom,
      positions
    }, token)

    const voies = await getVoies(baseLocale._id, commune.code)

    setIsAdding(false)
    setVoies(voies)
  }, [baseLocale, commune, token])

  const onEdit = useCallback(async (idVoie, {nom, positions}) => {
    await editVoie(idVoie, {
      nom,
      positions
    }, token)

    const voies = await getVoies(baseLocale._id, commune.code)

    setVoies(voies)
  }, [baseLocale, commune, token])

  const onRemove = useCallback(async idVoie => {
    await removeVoie(idVoie, token)

    const voies = await getVoies(baseLocale._id, commune.code)

    setVoies(voies)
  }, [baseLocale, commune, token])

  const onSelect = useCallback(voieId => {
    Router.push(
      `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&voieId=${voieId}`,
      `/bal/${baseLocale._id}/communes/${commune.code}/voies/${voieId}`
    )
  }, [baseLocale, commune])

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Breadcrumbs baseLocale={baseLocale} commune={commune} />
        <Pane padding={16} display='flex'>
          <Pane>
            <Heading marginBottom={8}>Liste des voies</Heading>
            <Paragraph size={300} margin={0} color='muted'>Lorem ipsum…</Paragraph>
          </Pane>
          {token && (
            <Pane marginLeft='auto'>
              <Button
                iconBefore='add'
                appearance='primary'
                intent='success'
                disabled={isAdding || isPopulating}
                onClick={() => setIsAdding(true)}
              >
                Ajouter une voie
              </Button>
            </Pane>
          )}
        </Pane>
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
                  onSubmit={onAdd}
                  onCancel={() => setIsAdding(false)}
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
          {filtered.map(voie => (
            <TableRow
              key={voie._id}
              id={voie._id}
              label={voie.nom}
              secondary={voie.positions.length === 1 ? 'Toponyme' : null}
              renderEditor={({onSubmit, onCancel}) => (
                <VoieEditor
                  initialValue={voie}
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                />
              )}
              onSelect={onSelect}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </Table>
      </Pane>
      {token && voies.length === 0 && (
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

Commune.getInitialProps = ({baseLocale, commune, voies}) => {
  return {
    layout: 'sidebar',
    baseLocale,
    commune,
    defaultVoies: voies
  }
}

export default Commune
