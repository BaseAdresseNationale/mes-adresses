import React from 'react'
import NextLink from 'next/link'
import {Pane, Heading, Paragraph, Button, Link} from 'evergreen-ui'

function Index() {
  return (
    <Pane display='flex' flex={1} flexDirection='column' overflowY='scroll'>
      <Pane paddingX={16} paddingBottom={16}>
        <Heading size={600} margin='default'>Créer une Base Adresse Locale vide</Heading>
        <Paragraph margin='default'>
          Si vous ne souhaitez pas partir des données de la Base Adresse Nationale, vous pouvez partir d’un fichier vide.
        </Paragraph>
        <Button>Créer</Button>
      </Pane>

      <Pane borderTop marginTop='auto' padding={16} paddingTop={8}>
        <NextLink href='/new/ban'>
          <Link href='/new/ban' display='block' marginY={6}>
            Créer une Base Adresse Locale à partir de la BAN
          </Link>
        </NextLink>
        <NextLink href='/new/upload'>
          <Link href='/new/upload' display='block' marginY={6}>
            Modifier une Base Adresse Locale existante
          </Link>
        </NextLink>
      </Pane>
    </Pane>
  )
}

Index.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default Index
