import React from 'react'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Table, IconButton, Popover, Menu, Position} from 'evergreen-ui'

import {getBaseLocale} from '../../lib/bal-api'
import {getCommune} from '../../lib/geo-api'
// import {getCommune} from '../../lib/storage'

import useFuse from '../../hooks/fuse'
import Breadcrumbs from '../../components/breadcrumbs'

const Commune = React.memo(({bal}) => {
  bal.commune.voies = []

  const [filtered, setFilter] = useFuse(bal.commune.voies, 200, {
    keys: [
      'nomVoie'
    ]
  })

  const onClick = voie => e => {
    if (e.target.closest('[data-browsable]')) {
      Router.push(
        `/bal/voie?balId=${bal.id}&communeCode=${bal.commune.code}&codeVoie=${voie.codeVoie}`,
        `/bal/${bal.id}/communes/${bal.commune.code}/voies/${voie.codeVoie}`
      )
    }
  }

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Breadcrumbs bal={bal} />
        <Pane padding={16}>
          <Heading>Liste des voies</Heading>
          <Paragraph size={300} margin={0} color='muted'>Lorem ipsum…</Paragraph>
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
          {filtered.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
          {filtered.map(voie => (
            <Table.Row key={voie.codeVoie} isSelectable onClick={onClick(voie)}>
              <Table.TextCell data-browsable>{voie.nomVoie}</Table.TextCell>
              <Table.TextCell data-browsable flex='0 1 1'>
                {voie.position ? 'Toponyme' : `${voie.numerosCount} numéros`}
              </Table.TextCell>
              <Table.TextCell flex='0 1 1'>
                <Popover
                  position={Position.BOTTOM_LEFT}
                  content={
                    <Menu>
                      <Menu.Group title='Actions'>
                        <Menu.Item icon='edit'>
                          Renommer
                        </Menu.Item>
                      </Menu.Group>
                      <Menu.Divider />
                      <Menu.Group title='destructive'>
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

Commune.getInitialProps = async ({baseLocale, query}) => {
  const commune = await getCommune(query.codeCommune, {
    fields: 'contour'
  })

  return {
    layout: 'sidebar',
    bal: {
      id: baseLocale._id,
      commune
    }
  }
}

export default Commune
