import React, {useState, useCallback} from 'react'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Table, Button, IconButton, Popover, Menu, Position} from 'evergreen-ui'

import {addVoie, getVoies} from '../../lib/bal-api'

import useToken from '../../hooks/token'
import useFuse from '../../hooks/fuse'

import Breadcrumbs from '../../components/breadcrumbs'
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
    setIsAdding(false)

    await addVoie(baseLocale._id, commune.code, {
      nom
    }, token)

    const voies = await getVoies(baseLocale._id, commune.code)

    setVoies(voies)
  }, [baseLocale, commune, token])

  const onClick = voie => e => {
    if (e.target.closest('[data-browsable]')) {
      Router.push(
        `/bal/voie?balId=${baseLocale._id}&communeCode=${commune.code}&codeVoie=${voie.codeVoie}`,
        `/bal/${baseLocale._id}/communes/${commune.code}/voies/${voie.codeVoie}`
      )
    }
  }

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
            <Table.Row key={voie._id} isSelectable onClick={onClick(voie)}>
              <Table.TextCell data-browsable>{voie.nom}</Table.TextCell>
              <Table.TextCell data-browsable flex='0 1 1'>
                {voie.position ? 'Toponyme' : `${voie.numerosCount || 0} numéros`}
              </Table.TextCell>
              <Table.TextCell flex='0 1 1'>
                <Popover
                  position={Position.BOTTOM_LEFT}
                  content={
                    <Menu>
                      <Menu.Group>
                        <Menu.Item icon='edit'>
                          Modifier
                        </Menu.Item>
                      </Menu.Group>
                      <Menu.Divider />
                      <Menu.Group>
                        <Menu.Item icon='trash' intent='danger'>
                          Supprimer…
                        </Menu.Item>
                      </Menu.Group>
                    </Menu>
                  }
                >
                  <IconButton height={24} icon='more' appearance='minimal' className='foo' />
                </Popover>
              </Table.TextCell>
            </Table.Row>
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
