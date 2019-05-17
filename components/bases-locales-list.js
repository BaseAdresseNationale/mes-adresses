import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Table} from 'evergreen-ui'

import useFuse from '../hooks/fuse'

import {listBasesLocales} from '../lib/bal-api'

function BasesLocalesList({basesLocales}) {
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

  const [filtered, onFilter] = useFuse(basesLocales, 200, {
    keys: [
      'nom',
      'commune'
    ]
  })

  return (
    <>
      {basesLocales.length > 0 && (
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
      )}
    </>
  )
}

BasesLocalesList.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()

  return {
    basesLocales,
    layout: 'fullscreen'
  }
}

BasesLocalesList.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default BasesLocalesList
