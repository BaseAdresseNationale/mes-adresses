import React from 'react'
import NextLink from 'next/link'
import {Pane, Heading, Paragraph, Link} from 'evergreen-ui'

function Index() {
  return (
    <Pane display='flex' flex={1} flexDirection='column' overflowY='scroll'>
      <Pane paddingX={16} paddingBottom={16}>
        <Heading size={600} margin='default'>Créer une Base Adresse Locale à partir de la BAN</Heading>
        <Paragraph>
          Toutes les données de votre collectivités contenues dans la Base Adresse Nationale seront recopiées dans votre fichier Base Adresse Locale.
        </Paragraph>
        <Paragraph>
          Vous pourrez dans quelques instants ajouter des voies, corriger des libellés, créer ou déplacer des numéros, et bien plus encore !
        </Paragraph>
      </Pane>

      <Pane borderTop marginTop='auto' padding={16} paddingTop={8}>
        <NextLink href='/new/upload'>
          <Link href='/new/upload' display='block' marginY={6}>
            Modifier une Base Adresse Locale existante
          </Link>
        </NextLink>
        <NextLink href='/new/empty'>
          <Link href='/new/empty' display='block' marginY={6}>
            Créer une Base Adresse Locale vide
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
