import {useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Table} from 'evergreen-ui'

import BaseLocaleCard from '@/components/base-locale-card'

function PublicBasesLocalesList({basesLocales, searchInput, onFilter}) {
  const onBalSelect = useCallback(bal => {
    Router.push(
      `/bal?balId=${bal._id}`,
      `/bal/${bal._id}`
    )
  }, [])

  return (
    <Pane borderTop>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            value={searchInput}
            placeholder='Rechercher une Base Adresse Locale'
            onChange={onFilter}
          />
        </Table.Head>
        {basesLocales.length === 0 && (
          <Table.Row>
            <Table.TextCell color='muted' fontStyle='italic'>
              Aucun résultat
            </Table.TextCell>
          </Table.Row>
        )}
        <Table.Body background='tint1'>
          {basesLocales.map(bal => (
            <BaseLocaleCard
              key={bal._id}
              baseLocale={bal}
              isDefaultOpen={basesLocales.length === 1}
              onSelect={() => onBalSelect(bal)}
            />
          ))}
        </Table.Body>
      </Table>
    </Pane>
  )
}

PublicBasesLocalesList.propTypes = {
  searchInput: ''
}

PublicBasesLocalesList.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  searchInput: PropTypes.string,
  onFilter: PropTypes.func
}

export default PublicBasesLocalesList
