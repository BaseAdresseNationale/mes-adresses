import React, {useState, useEffect, useRef} from 'react'
import Router from 'next/router'
import Fuse from 'fuse.js'
import {debounce} from 'lodash'
import {Pane, SearchInput, Heading, Table} from 'evergreen-ui'

import Storage from '../../lib/storage'

function Index({balId, communes}) {
  const fuse = useRef()
  const [shownCommunes, setShownCommunes] = useState(communes)

  useEffect(() => {
    fuse.current = new Fuse(communes, {
      shouldSort: true,
      threshold: 0.4,
      keys: [
        'nom'
      ]
    })
  }, [communes])

  const onSelect = commune => {
    Router.push(
      `/bal/commune?id=${balId}&communeCode=${commune.code}`,
      `/bal/${balId}/communes/${commune.code}`
    )
  }

  const onFilter = debounce(value => {
    if (fuse.current) {
      if (value) {
        setShownCommunes(fuse.current.search(value))
      } else {
        setShownCommunes(communes)
      }
    }
  }, 200)

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Pane padding={16}>
          <SearchInput placeholder='Rechercher une commune…' onChange={e => onFilter(e.target.value)} />
        </Pane>
      </Pane>
      <Pane flex={1} overflowY='scroll'>
        <Table>
          {shownCommunes.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
          {shownCommunes.map(commune => (
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
}

Index.getInitialProps = ({query}) => {
  const {id} = query

  if (id) {
    const bal = Storage.get(id)

    if (bal) {
      const communes = Object.values(bal.communes).map(({voies, ...commune}) => commune)

      return {
        layout: 'fullscreen',
        balId: id,
        communes
      }
    }
  }
}

export default Index
