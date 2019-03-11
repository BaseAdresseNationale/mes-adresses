import React from 'react'
import NextLink from 'next/link'
import {Pane, Heading, UnorderedList, ListItem, Link} from 'evergreen-ui'

function Index() {
  return (
    <Pane paddingX={16} paddingBottom={16}>
      <Heading size={600} margin='default'>Créer ou modifier une Base Adresse Locale</Heading>
      <UnorderedList>
        <ListItem>
          <NextLink href='/new/ban'>
            <Link href='/new/ban' display='block' marginY={6}>
              Créer une Base Adresse Locale à partir de la BAN
            </Link>
          </NextLink>
        </ListItem>
        <ListItem>
          <NextLink href='/new/upload'>
            <Link href='/new/upload' display='block' marginY={6}>
              Modifier une Base Adresse Locale existante
            </Link>
          </NextLink>
        </ListItem>
        <ListItem>
          <NextLink href='/new/empty'>
            <Link href='/new/empty' display='block' marginY={6}>
              Créer une Base Adresse Locale vide
            </Link>
          </NextLink>
        </ListItem>
      </UnorderedList>
    </Pane>
  )
}

Index.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default Index
