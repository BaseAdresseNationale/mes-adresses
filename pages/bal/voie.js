import React from 'react'
import {Pane, Paragraph, Heading, Table, IconButton, Popover, Menu, Position} from 'evergreen-ui'

import {getCommune} from '../../lib/storage'

import Breadcrumbs from '../../components/breadcrumbs'

const Voie = React.memo(({bal}) => {
  const onClick = numero => e => {
    if (e.target.closest('[data-browsable]')) {
      console.log(numero)
    }
  }

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Breadcrumbs bal={bal} />
        <Pane padding={16}>
          <Heading>Liste des numéros</Heading>
          <Paragraph size={300} margin={0} color='muted'>Lorem ipsum…</Paragraph>
        </Pane>
      </Pane>

      <Pane flex={1} overflowY='scroll'>
        <Table>
          {Object.values(bal.voie.numeros).map(numero => (
            <Table.Row key={numero.numeroComplet} isSelectable onClick={onClick(numero)}>
              <Table.TextCell data-browsable>{numero.numeroComplet}</Table.TextCell>
              <Table.TextCell data-browsable flex='0 1 1'>
                {bal.voie.source.join(', ')}
              </Table.TextCell>
              <Table.TextCell flex='0 1 1'>
                <Popover
                  position={Position.BOTTOM_LEFT}
                  content={
                    <Menu>
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

Voie.getInitialProps = async ({query}) => {
  const {balId, communeCode, codeVoie} = query
  const commune = await getCommune(balId, communeCode)
  const voie = commune.voies.find(voie => voie.codeVoie === codeVoie)

  return {
    layout: 'sidebar',
    bal: {
      commune,
      voie
    }
  }
}

export default Voie
