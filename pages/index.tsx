import React from 'react'
import dynamic from 'next/dynamic'
import {Pane, Button, Heading, PlusIcon, Spinner} from 'evergreen-ui'
import Link from 'next/link'

import Main from '@/layouts/main'

import BALRecovery from '@/components/bal-recovery/bal-recovery'

const CSRUserBasesLocales = dynamic(() => import('../components/user-bases-locales.js') as any, {
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
        <Link legacyBehavior href='/new' passHref>
          <Button iconBefore={PlusIcon} is='a'>
            Créer une Base Adresse Locale
          </Button>
        </Link>
      </Heading>

      <CSRUserBasesLocales />

      <Pane padding={22}>
        <BALRecovery />
      </Pane>
    </Main>
  )
}

export default Index
