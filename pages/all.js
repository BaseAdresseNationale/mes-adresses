import {useState} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {Pane, Heading, Paragraph, Spinner, Button, Pagination} from 'evergreen-ui'

import {searchBasesLocales} from '@/lib/bal-api'
import {sortBalByUpdate} from '@/lib/sort-bal'

import Main from '@/layouts/main'

const PublicBasesLocalesList = dynamic(() => import('@/components/bases-locales-list/public-bases-locales-list'), { // eslint-disable-line node/no-unsupported-features/es-syntax
  ssr: false,
  loading: () => (
    <Pane height='100%' display='flex' flex={1} alignItems='center' justifyContent='center'>
      <Spinner />
    </Pane>
  )
})

function All({basesLocales, commune, limit, offset, count}) {
  const router = useRouter()
  const totalPages = Math.ceil(count / limit)
  const currentPage = Math.ceil((offset - 1) / limit) + 1

  const [input, setInput] = useState(commune || '')

  const onFilter = async value => {
    const query = {page: currentPage, limit}

    if (value.length > 0) {
      query.commune = value
    }

    router.push({pathname: '/all', query})
  }

  const handlePageChange = page => {
    router.push({
      pathname: '/all',
      query: {page, limit}
    })
  }

  const handleInput = value => {
    setInput(prev => {
      const input = value.slice(0, 5)

      if (input !== prev && (input.length === 5 || input.length === 0)) {
        onFilter(input)
      }

      return input
    })
  }

  return (
    <Main>
      <Pane padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Rechercher une Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une Base Adresse Locale que vous souhaitez visualiser, créer ou modifier.
        </Paragraph>
      </Pane>

      <Pane flex={1} overflowY='scroll'>
        <PublicBasesLocalesList
          basesLocales={basesLocales}
          searchInput={input}
          onFilter={handleInput} />
      </Pane>

      {totalPages > 1 && (
        <Pagination
          marginX='auto'
          page={currentPage}
          totalPages={totalPages}
          onPreviousPage={() => handlePageChange(currentPage - 1)}
          onPageChange={handlePageChange}
          onNextPage={() => handlePageChange(currentPage + 1)}
        />
      )}

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez également créer une nouvelle Base Adresse Locale.
        </Paragraph>
        <Link href='/new' passHref legacyBehavior>
          <Button marginTop={10} appearance='primary' is='a'>
            Créer une nouvelle Base Adresse Locale
          </Button>
        </Link>
      </Pane>
    </Main>
  )
}

All.getInitialProps = async ({query}) => {
  let result

  try {
    result = await searchBasesLocales(query)
  } catch {}

  return {
    ...result,
    commune: query.commune || '',
    basesLocales: result ? sortBalByUpdate(result.results) : []
  }
}

All.defaultProps = {
  offset: 0,
  limit: 20,
  count: 0
}

All.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  commune: PropTypes.string.isRequired,
  offset: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number
}

export default All
