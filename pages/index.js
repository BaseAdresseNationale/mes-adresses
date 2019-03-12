import React, {useState, useMemo, useCallback} from 'react'
import {Pane, Heading, Table, Paragraph, Alert, Button} from 'evergreen-ui'

import {list} from '../lib/bal'

import useFuse from '../hooks/fuse'
import CommuneSearch from '../components/commune-search'

function Index({bals}) {
  const [commune, setCommune] = useState()

  const onSelect = useCallback(commune => {
    setCommune(commune)
  }, [])

  const matchingBals = useMemo(() => {
    return commune ? bals.filter(bal => bal.communes.includes(commune.code)) : []
  }, [bals, commune])

  const [filtered, onFilter] = useFuse(matchingBals, 200, {
    keys: [
      'nom',
      'commune'
    ]
  })

  return (
    <>
      <Pane paddingX={16} paddingBottom={10} marginBottom={10}>
        <Heading size={600} margin='default'>Créer ou modifier une Base Adresse Locale</Heading>
        <Paragraph marginBottom={16}>
          Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
        </Paragraph>
        <CommuneSearch
          placeholder='Rechercher une commune…'
          width='100%'
          onSelect={onSelect}
        />
      </Pane>
      {commune && (
        <>
          {matchingBals.length === 0 ? (
            <Pane borderTop padding={16}>
              <Alert title='Aucune Base Adresse Locale ne contient cette commune'>
                <Paragraph size={300} color='muted'>
                  Vous pouvez créer une nouvelle Base Adresse Locale pour la commune de {commune.nom}.
                </Paragraph>
                <Button marginTop={10} appearance='primary'>
                  Créer une nouvelle Base Adresse Locale
                </Button>
              </Alert>
            </Pane>
          ) : (
            <>
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
                      <Table.Row key={bal._id} isSelectable>
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
                  Vous pouvez également créer une nouvelle Base Adresse Locale pour la commune de {commune.nom}.
                </Paragraph>
                <Button marginTop={10} appearance='primary'>
                  Créer une nouvelle Base Adresse Locale
                </Button>
              </Pane>
            </>
          )}
        </>
      )}
    </>
  )
}

Index.getInitialProps = async () => {
  const bals = await list()

  return {
    bals,
    layout: 'fullscreen'
  }
}

export default Index
