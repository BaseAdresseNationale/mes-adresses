import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Button, Spinner} from 'evergreen-ui'

import FullscreenContainer from '../components/fullscreen-container'

const UserBasesLocales = dynamic(() => import('../components/user-bases-locales'), {
  ssr: false,
  loading: () => (
    <Pane display='flex' flex={1} alignItems='center' justifyContent='center'>
      <Spinner />
    </Pane>
  )
})

function Index() {
  return (
    <FullscreenContainer title='Bienvenue sur l’Éditeur de Base Adresse Locale' subtitle='Créez une Base Adresse Locale ou sélectionnez une de vos Bases Adresse Locales afin de poursuivre son édition.'>
      <Pane display='flex' flex={1} flexDirection='column'>
        <UserBasesLocales />

        <Pane
          display='flex'
          height='50%'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
          padding={16}
        >
          <Button
            iconBefore='plus'
            marginTop={10}
            appearance='primary'
            height={40}
            onClick={() => Router.push('/new')}
          >
            Créer Base Adresse Locale
          </Button>
          <Button
            marginTop={10}
            height={40}
            onClick={() => Router.push('/new?test=1')}
          >
              Essayer l’éditeur de base adresse locale
          </Button>
        </Pane>
      </Pane>
    </FullscreenContainer>
  )
}

Index.getInitialProps = async () => {
  return {
    layout: 'fullscreen'
  }
}

export default Index
