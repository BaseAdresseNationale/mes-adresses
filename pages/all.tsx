import React, {useState} from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Pane, Heading, Paragraph, Button, Pagination, Spinner} from 'evergreen-ui'

import {searchBasesLocales} from '@/lib/bal-api'
import {sortBalByUpdate} from '@/lib/sort-bal'

import Main from '@/layouts/main'
import { BaseLocale } from '@/lib/openapi/index.js'

interface PublicBasesLocalesListProps {
  basesLocales: BaseLocale[];
  searchInput: string;
  onFilter: (value: string) => void;
}

const CSRPublicBasesLocalesList: React.ComponentType<PublicBasesLocalesListProps> = dynamic(() => import('../components/bases-locales-list/public-bases-locales-list.js') as any, {
  ssr: false,
  loading: () => (
    <Pane height='100%' display='flex' flex={1} alignItems='center' justifyContent='center'>
      <Spinner />
    </Pane>
  )
})

interface AllPageProps {
  basesLocales: BaseLocale[];
  commune: string;
  offset: number;
  limit: number;
  count: number;
}

function All({basesLocales, commune, limit = 20, offset = 0, count = 0}: AllPageProps) {
  const router = useRouter()
  const totalPages = Math.ceil(count / limit)
  const currentPage = Math.ceil((offset - 1) / limit) + 1

  const [input, setInput] = useState(commune || '')

  const onFilter = async value => {
    const query = {page: currentPage, limit, commune: undefined}

    if (value.length > 0) {
      query.commune = value
    }

    await router.push({pathname: '/all', query})
  }

  const handlePageChange = async page => {
    await router.push({
      pathname: '/all',
      query: {page, limit}
    })
  }

  const handleInput = value => {
    setInput(prev => {
      const input = value.slice(0, 5)

      if (input !== prev && (input.length === 5 || input.length === 0)) {
        void onFilter(input)
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
        <CSRPublicBasesLocalesList
          basesLocales={basesLocales}
          searchInput={input}
          onFilter={handleInput} />
      </Pane>

      {totalPages > 1 && (
        <Pagination
          marginX='auto'
          page={currentPage}
          totalPages={totalPages}
          onPreviousPage={async () => handlePageChange(currentPage - 1)}
          onPageChange={handlePageChange}
          onNextPage={async () => handlePageChange(currentPage + 1)}
        />
      )}

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez également créer une nouvelle Base Adresse Locale.
        </Paragraph>
        <Link legacyBehavior href='/new' passHref>
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

export default All
