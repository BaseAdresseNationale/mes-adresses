import React, {useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import Router from 'next/router'
import {Pane, Heading, Table, Paragraph, Alert, Button, Link} from 'evergreen-ui'

import {listBasesLocales} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import useFocus from '../hooks/focus'
import useFuse from '../hooks/fuse'
import {CommuneSearch} from '../components/commune-search'

function Index({basesLocales, defaultCommune}) {
  const focusRef = useFocus()

  const onCommuneSelect = useCallback(commune => {
    Router.push(`/?commune=${commune.code}`)
  }, [])

  const onBalSelect = useCallback(bal => {
    Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
  }, [])

  const onCreate = useCallback(() => {
    Router.push(`/new?commune=${defaultCommune.code}`)
  }, [defaultCommune])

  const onCreateUpload = useCallback(() => {
    Router.push('/new/upload')
  }, [])

  const matchingBals = useMemo(() => {
    return defaultCommune ? basesLocales.filter(bal => bal.communes.includes(defaultCommune.code)) : []
  }, [basesLocales, defaultCommune])

  const [filtered, onFilter] = useFuse(matchingBals, 200, {
    keys: [
      'nom',
      'commune'
    ]
  })

  return (
    <>
      <Pane borderBottom padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Rechercher une Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une commune pour laquelle vous souhaitez visualiser, créer ou modifier une Base Adresse Locale.
        </Paragraph>
      </Pane>
      <Pane padding={16}>
        <CommuneSearch
          innerRef={defaultCommune ? null : focusRef}
          placeholder='Rechercher une commune…'
          defaultSelectedItem={defaultCommune}
          width='100%'
          onSelect={onCommuneSelect}
        />
      </Pane>
      {defaultCommune ? (
        <>
          {matchingBals.length === 0 ? (
            <Pane borderTop padding={16}>
              <Alert title='Aucune Base Adresse Locale ne contient cette commune'>
                <Paragraph size={300} color='muted'>
                  Vous pouvez créer une nouvelle Base Adresse Locale pour la commune de {defaultCommune.nom}.
                </Paragraph>
                <Button marginTop={10} appearance='primary' onClick={onCreate}>
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
                  Vous pouvez également créer une nouvelle Base Adresse Locale pour la commune de {defaultCommune.nom}.
                </Paragraph>
                <Button marginTop={10} appearance='primary' onClick={onCreate}>
                  Créer une nouvelle Base Adresse Locale
                </Button>
              </Pane>
            </>
          )}
        </>
      ) : (
        <>
          <Pane paddingX={16} textAlign='right'>
            <NextLink href='/all'>
              <Link href='/all' size={300}>Voir toutes les Bases Adresses Locales</Link>
            </NextLink>
          </Pane>
          <Pane borderTop marginTop='auto' padding={16}>
            <Paragraph size={300} color='muted'>
              Vous pouvez créer une nouvelle Base Adresse Locale à partir d’un fichier CSV conforme au modèle BAL 1.1 de l’AITF.
            </Paragraph>
            <Button marginTop={10} onClick={onCreateUpload}>
              Créer une nouvelle Base Adresse Locale
            </Button>
          </Pane>
        </>
      )}
    </>
  )
}

Index.getInitialProps = async ({query}) => {
  let defaultCommune
  if (query.commune) {
    defaultCommune = await getCommune(query.commune, {
      fields: 'departement'
    })
  }

  const basesLocales = await listBasesLocales()

  return {
    defaultCommune,
    basesLocales,
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  defaultCommune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
}

export default Index
