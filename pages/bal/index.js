import React, {useState, useEffect, useRef} from 'react'
import Router from 'next/router'
import Fuse from 'fuse.js'
import {debounce} from 'lodash'
import {Pane, Heading, Button, Table, Paragraph} from 'evergreen-ui'

import {getCommunes} from '../../lib/storage'

import CommuneSearch from '../../components/commune-search'

const Index = React.memo(({bal}) => {
  const fuse = useRef()
  const [communes, setCommunes] = useState(bal.communes)
  const [filtered, setFiltered] = useState(bal.communes)
  const [selectedCommune, setSelectedCommune] = useState()
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fuse.current = new Fuse(communes, {
      shouldSort: true,
      threshold: 0.4,
      keys: [
        'code',
        'nom'
      ]
    })

    setFiltered(communes)
  }, [communes])

  const onSelect = commune => {
    Router.push(
      `/bal/commune?id=${bal.id}&communeCode=${commune.code}`,
      `/bal/${bal.id}/communes/${commune.code}`
    )
  }

  const onFilter = debounce(value => {
    if (fuse.current) {
      if (value) {
        setFiltered(fuse.current.search(value))
      } else {
        setFiltered(fuse.current.list)
      }
    }
  }, 200)

  const onCommuneSelect = commune => {
    setSelectedCommune(commune)
  }

  const onCommuneAdd = e => {
    e.preventDefault()

    setCommunes([
      selectedCommune,
      ...communes
    ])

    setIsAdding(false)
    setSelectedCommune(null)
  }

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Pane padding={16} display='flex'>
          <Pane>
            <Heading>Liste des communes</Heading>
            <Paragraph size={300} margin={0} color='muted'>Lorem ipsum…</Paragraph>
          </Pane>
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
  const {id} = query
  const communes = await getCommunes(id)

  return {
    layout: 'fullscreen',
    bal: {
      id,
      communes
    }
  }
}

export default Index
