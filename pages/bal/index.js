import React from 'react'
import Router from 'next/router'
import {Heading, Table} from 'evergreen-ui'

import Storage from '../../lib/storage'

function Index({bal}) {
  const onSelect = commune => {
    Router.push(
      `/bal/commune?id=${bal._id}&communeCode=${commune.code}`,
      `/bal/${bal._id}/communes/${commune.code}`
    )
  }

  return (
    <>
      <Heading size={600} margin='default'>Liste des communes</Heading>
      <Table>
        {Object.values(bal.communes).map(commune => (
          <Table.Row key={commune.code} isSelectable onSelect={() => onSelect(commune)}>
            <Table.TextCell isNumber flex='0 1 1'>{commune.code}</Table.TextCell>
            <Table.TextCell>{commune.nom}</Table.TextCell>
            <Table.TextCell flex='0 1 1'>{commune.voiesCount} voies</Table.TextCell>
          </Table.Row>
        ))}
      </Table>
    </>
  )
}

Index.getInitialProps = ({query}) => {
  const {id} = query

  if (id) {
    const bal = Storage.get(id)

    if (bal) {
      return {
        layout: 'fullscreen',
        bal
      }
    }
  }
}

export default Index
