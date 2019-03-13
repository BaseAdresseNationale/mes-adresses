import React, {useState} from 'react'
import Router from 'next/router'
import {Pane, Heading, Button, Table, Paragraph} from 'evergreen-ui'

import {getBaseLocale, addCommune} from '../../lib/bal-api'
import {getCommune} from '../../lib/geo-api'

import useToken from '../../hooks/token'
import useFuse from '../../hooks/fuse'
import {CommuneSearch} from '../../components/commune-search'

const Index = React.memo(({baseLocale, bal}) => {
  const [communes, setCommunes] = useState(bal.communes)
  const [selectedCommune, setSelectedCommune] = useState()
  const [isAdding, setIsAdding] = useState(false)
  const token = useToken(baseLocale._id)

  const [filtered, onFilter] = useFuse(communes, 200, {
    keys: [
      'nom'
    ]
  })

  const onSelect = commune => {
    Router.push(
      `/bal/commune?id=${baseLocale._id}&codeCommune=${commune.code}`,
      `/bal/${baseLocale._id}/communes/${commune.code}`
    )
  }

  const onCommuneSelect = commune => {
    setSelectedCommune(commune.code)
  }

  const onCommuneAdd = async e => {
    e.preventDefault()

    const updated = await addCommune(baseLocale._id, selectedCommune, token)

    const updatedCommunes = await Promise.all(
      updated.communes.map(commune => getCommune(commune))
    )

    setCommunes(updatedCommunes)

    setIsAdding(false)
    setSelectedCommune(null)
  }

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Pane padding={16} display='flex'>
          <Pane>
            <Heading>{baseLocale.nom}</Heading>
            <Paragraph size={300} margin={0} color='muted'>{baseLocale.description || 'Base Adresse Locale'}</Paragraph>
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
                Ajouter une commune
              </Button>
            </Pane>
          )}
        </Pane>
      </Pane>
      <Pane flex={1} overflowY='scroll'>
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              disabled={isAdding}
              placeholder='Rechercher une commune…'
              onChange={onFilter}
            />
          </Table.Head>
          {isAdding && (
            <Table.Row>
              <Table.Cell is='form' display='flex' onSubmit={onCommuneAdd}>
                <CommuneSearch width='100%' exclude={communes.map(c => c.code)} onSelect={onCommuneSelect} />
                <Button type='submit' appearance='primary' intent='success' marginLeft={6} disabled={!selectedCommune}>
                  Ajouter
                </Button>
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
          {filtered.map(commune => (
            <Table.Row key={commune.code} isSelectable onSelect={() => onSelect(commune)}>
              <Table.TextCell isNumber flex='0 1 1'>{commune.code}</Table.TextCell>
              <Table.TextCell>{commune.nom}</Table.TextCell>
              <Table.TextCell flex='0 1 1'>{commune.voiesCount} voies</Table.TextCell>
            </Table.Row>
          ))}
        </Table>
      </Pane>
    </>
  )
})

Index.getInitialProps = async ({query}) => {
  const baseLocale = await getBaseLocale(query.id)

  const communes = await Promise.all(
    baseLocale.communes.map(commune => getCommune(commune))
  )

  return {
    layout: 'fullscreen',
    baseLocale,
    bal: {
      id: baseLocale._id,
      communes
    }
  }
}

export default Index
