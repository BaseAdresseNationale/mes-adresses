import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Button, Spinner, Heading, Text} from 'evergreen-ui'

import Nav from '../components/nav'
import Footer from '../components/footer'

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
      <Pane display='flex' flexDirection='column' alignItems='center' justifyContent='center' backgroundColor='#0053b3' height='115px' padding='1em' flexShrink='0'>
        <Text color='snow'>
          Vous voulez simplement essayer l’éditeur, sans créer de Base Adresse Locale ?
        </Text>
        <Pane marginTop='1em'>
          <Button onClick={() => Router.push('/new?test=1')}>Cliquez ici</Button>
        </Pane>
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
