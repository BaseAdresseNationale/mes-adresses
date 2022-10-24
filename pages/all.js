import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {useDebouncedCallback} from 'use-debounce'
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

function All({basesLocales, nom, limit, offset, count}) {
  const router = useRouter()
  const totalPages = Math.ceil(count / limit)
  const currentPage = Math.ceil((offset - 1) / limit) + 1

  const [onFilter] = useDebouncedCallback(async value => {
    const query = {page: count, limit}

    if (value.length >= 2) {
      query.nom = value
    }

    router.push({pathname: '/all', query})
  }, 400)

  const handlePageChange = page => {
    router.push({
      pathname: '/all',
      query: {page, limit}
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
          searchInput={nom}
          onFilter={onFilter} />
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
        <Link href='/new' passHref>
          <Button marginTop={10} appearance='primary' is='a'>
            Créer une nouvelle Base Adresse Locale
          </Button>
        </Link>
      </Pane>
    </Main>
  )
}

All.getInitialProps = async ({query}) => {
  const result = await searchBasesLocales(query)

  return {
    ...result,
    nom: query.nom || '',
    basesLocales: sortBalByUpdate(result.results)
  }
}

All.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  nom: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired
}

export default All
