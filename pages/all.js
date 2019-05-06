import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Heading, Table, Paragraph, Button} from 'evergreen-ui'

import {listBasesLocales} from '../lib/bal-api'

import useFuse from '../hooks/fuse'

function All({basesLocales}) {
  const onBalSelect = useCallback(bal => {
    if (bal.communes.length === 1) {
      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${bal.communes[0]}`,
        `/bal/${bal._id}/communes/${bal.communes[0]}`
      )
    } else {
      Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
    }
  }, [])

  const onCreate = useCallback(() => {
    Router.push('/new')
  }, [])

  const [filtered, onFilter] = useFuse(basesLocales, 200, {
    keys: [
      'nom',
      'commune'
    ]
  })

  return (
    <>
      <Pane padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Rechercher une Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une Base Adresse Locale que vous souhaitez visualiser, créer ou modifier.
        </Paragraph>
      </Pane>
      <Pane borderTop flex={1} overflowY='scroll'>
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              placeholder='Rechercher une Base Adresse Locale'
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
          <Table.Body background='tint1'>
            {filtered.map(bal => (
              <Table.Row key={bal._id} isSelectable onSelect={() => onBalSelect(bal)}>
                <Table.TextCell>{bal.nom}</Table.TextCell>
                <Table.TextCell flex='0 1 1'>
                  {bal.communes.length < 2 ? `${bal.communes.length} commune` : `${bal.communes.length} communes`}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez également créer une nouvelle Base Adresse Locale.
        </Paragraph>
        <Button marginTop={10} appearance='primary' onClick={onCreate}>
          Créer une nouvelle Base Adresse Locale
        </Button>
      </Pane>
    </>
  )
}

All.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()

  return {
    basesLocales,
    layout: 'fullscreen'
  }
}

All.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default All
