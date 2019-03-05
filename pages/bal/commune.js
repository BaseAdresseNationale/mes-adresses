import React, {useState, useEffect, useRef} from 'react'
import Router from 'next/router'
import Fuse from 'fuse.js'
import {debounce} from 'lodash'
import {Pane, Heading, Paragraph, Table, IconButton, Popover, Menu, Position} from 'evergreen-ui'

import {getCommune} from '../../lib/storage'

import Breadcrumbs from '../../components/breadcrumbs'

const Commune = React.memo(({bal}) => {
  const fuse = useRef()
  const [filtered, setFiltered] = useState(bal.commune.voies)

  useEffect(() => {
    fuse.current = new Fuse(bal.commune.voies, {
      shouldSort: true,
      threshold: 0.4,
      keys: [
        'nomVoie'
      ]
    })
  }, [bal])

  const onFilter = debounce(value => {
    if (fuse.current) {
      if (value) {
        setFiltered(fuse.current.search(value))
      } else {
        setFiltered(bal.commune.voies)
      }
    }
  }, 200)

  const onClick = voie => e => {
    if (e.target.closest('[data-browsable]')) {
      Router.push(
        `/bal/voie?id=${bal.id}&communeCode=${bal.commune.code}&codeVoie=${voie.codeVoie}`,
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
              onChange={onFilter}
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

Commune.getInitialProps = async ({query}) => {
  const {id, communeCode} = query
  const commune = await getCommune(id, communeCode)

  return {
    layout: 'sidebar',
    bal: {
      id,
      commune
    }
  }
}

export default Commune
