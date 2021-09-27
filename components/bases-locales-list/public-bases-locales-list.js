import React, {useCallback, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Table, Button, PlusIcon} from 'evergreen-ui'

import {sortBalByUpdate} from '../../lib/sort-bal'

import useFuse from '../../hooks/fuse'

import {listBasesLocales} from '../../lib/bal-api'

import BaseLocaleCard from './base-locale-card'

function PublicBasesLocalesList({basesLocales, sortBal}) {
  const [limit, setLimit] = useState(50)

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
      'nom'
    ]
  })

  const slicedBasesLocalesList = useMemo(() => {
    return sortBal(filtered).slice(0, limit)
  }, [filtered, sortBal, limit])

  return (
    <>
      <Pane borderTop>
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              placeholder='Rechercher une Base Adresse Locale'
              onChange={onFilter}
            />
          </Table.Head>
          {slicedBasesLocalesList.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
          <Table.Body background='tint1'>
            {slicedBasesLocalesList.map(bal => (
              <BaseLocaleCard
                key={bal._id}
                baseLocale={bal}
                initialIsOpen={basesLocales.length === 1}
                onSelect={() => onBalSelect(bal)}
              />
            ))}
            {limit < filtered.length && (
              <Pane style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                <Button
                  appearance='minimal'
                  marginBottom='1em'
                  iconAfter={PlusIcon}
                  onClick={() => setLimit(limit => limit + 50)}
                >
                  Afficher les 50 Bases Locales suivantes
                </Button>
              </Pane>
            )}
          </Table.Body>
        </Table>
      </Pane>
    </>
  )
}

PublicBasesLocalesList.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()

  return {
    basesLocales
  }
}

PublicBasesLocalesList.defaultProps = {
  sortBal: sortBalByUpdate
}

PublicBasesLocalesList.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  sortBal: PropTypes.func
}

export default PublicBasesLocalesList
