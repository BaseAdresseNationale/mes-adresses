import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Button, Spinner, Heading, PlusIcon} from 'evergreen-ui'

import Header from '../components/header'
import Footer from '../components/footer'
import BALRecovery from '../components/bal-recovery/bal-recovery'

const UserBasesLocales = dynamic(() => import('../components/user-bases-locales'), {
  ssr: false,
  loading: () => (
    <Pane height='100%' display='flex' flex={1} alignItems='center' justifyContent='center'>
      <Spinner />
    </Pane>
  )
})

function Index() {
  return (
    <Pane height='100vh' display='flex' flexDirection='column'>
      <Header />
      <Heading
        padding={16}
        size={400}
        color='snow'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        backgroundColor='#0053b3'
        flexShrink='0'
      >
        Mes Bases Adresse Locales
        <Button iconBefore={PlusIcon} onClick={() => Router.push('/new')}>
          Créer une Base Adresse Locale
        </Button>
      </Heading>

      <UserBasesLocales />

      <Pane padding={22}>
        <BALRecovery />
      </Pane>
      <Footer />
    </Pane>
  )
}

Index.getInitialProps = async () => {
  return {
    layout: 'fullscreen'
  }
}

export default Index
