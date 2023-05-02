import dynamic from 'next/dynamic'
import {Pane, Button, Spinner, Heading, PlusIcon} from 'evergreen-ui'
import Link from 'next/link'

import Main from '@/layouts/main'

import BALRecovery from '@/components/bal-recovery/bal-recovery'

const UserBasesLocales = dynamic(() => import('@/components/user-bases-locales'), { // eslint-disable-line node/no-unsupported-features/es-syntax
  ssr: false,
  loading: () => (
    <Pane height='100%' display='flex' flex={1} alignItems='center' justifyContent='center'>
      <Spinner />
    </Pane>
  )
})

function Index() {
  return (
    <Main>
      <Heading padding={16} size={400} color='snow' display='flex' justifyContent='space-between' alignItems='center' backgroundColor='#0053b3' flexShrink='0'>
        Mes Bases Adresse Locales
        <Link href='/new' passHref legacyBehavior>
          <Button iconBefore={PlusIcon} is='a'>
            Créer une Base Adresse Locale
          </Button>
        </Link>
      </Heading>

      <UserBasesLocales />

      <Pane padding={22}>
        <BALRecovery />
      </Pane>
    </Main>
  )
}

export default Index
