import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Button, Spinner, Link} from 'evergreen-ui'

const UserBasesLocales = dynamic(() => import('../components/user-bases-locales'), {
  ssr: false,
  loading: () => (
    <Pane display='flex' alignItems='center' justifyContent='center' height={400}>
      <Spinner />
    </Pane>
  )
})

function Index() {
  return (
    <>
      <Pane borderBottom padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Bienvenue sur l’Éditeur de Base Adresse Locale</Heading>
        <Paragraph>
          Créez une Base Adresse Locale ou sélectionnez une de vos Bases Adresse Locales afin de poursuivre son édition.
        </Paragraph>
      </Pane>

      <Pane display='flex' flexDirection='column'>
        <Pane flex={1} overflowY='scroll'>
          <UserBasesLocales />
        </Pane>

        <Pane
          display='flex'
          height={100}
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

        <Pane
          textAlign='center'
          padding='1em'
        >
          <Link href='https://adresse.data.gouv.fr/guides' fontSize='1em'>Télécharger le guide de la Base Adresse Locale</Link>
        </Pane>
      </Pane>

    </>
  )
}

Index.getInitialProps = async () => {
  return {
    layout: 'fullscreen'
  }
}

export default Index
