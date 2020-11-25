import React, {useContext} from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Button, Spinner, Heading, PlusIcon} from 'evergreen-ui'

import TokenContext from '../contexts/token'

import Header from '../components/header'
import Footer from '../components/footer'
import DemoBALAlert from '../components/demo-bal-alert'

const UserBasesLocales = dynamic(() => import('../components/user-bases-locales'), {
  ssr: false,
  loading: () => (
    <Pane height='100%' display='flex' flex={1} alignItems='center' justifyContent='center'>
      <Spinner />
    </Pane>
  )
})

function Index() {
  const {hasRecovered} = useContext(TokenContext)
  return (
    <Pane height='100vh' display='flex' flexDirection='column'>
      <Header />
      {hasRecovered ? (
        <>
          <Heading padding={16} size={400} color='snow' display='flex' justifyContent='space-between' alignItems='center' backgroundColor='#0053b3' flexShrink='0'>
            Mes Bases Adresse Locales
            <Button iconBefore={PlusIcon} onClick={() => Router.push('/new')}>Créer une Base Adresse Locale</Button>
          </Heading>
          <UserBasesLocales />
          <DemoBALAlert />
          <Footer />
        </>
      ) : (
        <Pane height='100%' display='flex' flexDirection='column' flex={1} alignItems='center' justifyContent='center'>
          <Spinner />
        </Pane>
      )}
    </Pane>
  )
}

Index.getInitialProps = async () => {
  return {
    layout: 'fullscreen'
  }
}

export default Index
