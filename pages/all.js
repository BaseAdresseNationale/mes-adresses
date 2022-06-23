import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {Pane, Heading, Paragraph, Spinner, Button} from 'evergreen-ui'

import {listBasesLocales} from '@/lib/bal-api'
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

function All({basesLocales}) {
  return (
    <Main>
      <Pane padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Rechercher une Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une Base Adresse Locale que vous souhaitez visualiser, créer ou modifier.
        </Paragraph>
      </Pane>

      <Pane flex={1} overflowY='scroll'>
        <PublicBasesLocalesList basesLocales={basesLocales} sortBal={sortBalByUpdate} />
      </Pane>

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

All.getInitialProps = async () => {
  return {
    basesLocales: await listBasesLocales({fetchDeleted: true})
  }
}

All.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default All
