import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Button, Spinner, Heading} from 'evergreen-ui'

import Nav from '../components/nav'
import Footer from '../components/footer'
import DemoBal from '../components/demo-bal'

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
    <Pane display='flex' flexDirection='column' overflowY='scroll' height='100%'>
      <Nav />
      <Heading padding={16} size={400} color='snow' display='flex' justifyContent='space-between' alignItems='center' backgroundColor='#0053b3' flexShrink='0'>
        Mes Bases Adresse Locales
        <Button iconBefore='plus' onClick={() => Router.push('/new')}>Créer une Base Adresse Locale</Button>
      </Heading>
      <UserBasesLocales />
      <DemoBal />
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
