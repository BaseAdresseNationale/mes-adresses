import React, {useState, useCallback} from 'react'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Table, Button} from 'evergreen-ui'

import {addVoie, getVoies} from '../../lib/bal-api'

import useToken from '../../hooks/token'
import useFuse from '../../hooks/fuse'

import Breadcrumbs from '../../components/breadcrumbs'
import TableRow from '../../components/table-row'
import VoieAdd from '../../components/bal/voie-add'

const Commune = React.memo(({baseLocale, commune, defaultVoies}) => {
  const [voies, setVoies] = useState(defaultVoies)
  const [isAdding, setIsAdding] = useState(false)
  const token = useToken(baseLocale._id)

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })

  const onVoieAdd = useCallback(async ({nom}) => {
    await addVoie(baseLocale._id, commune.code, {
      nom
    }, token)

    const voies = await getVoies(baseLocale._id, commune.code)

    setIsAdding(false)
    setVoies(voies)
  }, [baseLocale, commune, token])

  const onSelect = useCallback(voieId => {
    Router.push(
      `/bal/voie?balId=${baseLocale._id}&communeCode=${commune.code}&codeVoie=${voieId}`,
      `/bal/${baseLocale._id}/communes/${commune.code}/voies/${voieId}`
    )
  }, [baseLocale._id, commune.code])

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
                disabled={isAdding}
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
                <VoieAdd
                  onSubmit={onVoieAdd}
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
              secondary={voie.position ? 'Toponyme' : `${voie.numerosCount || 0} numéros`}
              onSelect={onSelect}
            />
          ))}
        </Table>
      </Pane>
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
