import React from 'react'
import Link from 'next/link'
import {Pane, Heading, Button, Icon, ArrowLeftIcon, RouteIcon} from 'evergreen-ui'

import Main from '@/layouts/main'

function Custom404() {
  return (
    <Main>
      <Pane
        display='flex'
        flex={1}
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
        height='50%'
      >
        <Icon icon={RouteIcon} size={100} marginX='auto' marginY={16} color='#101840' />
        <Heading size={800} marginBottom='2em'>Erreur 404 - Page introuvable</Heading>
        <Link legacyBehavior href='/' passHref>
          <Button iconBefore={ArrowLeftIcon} is='a'>
            Retour à la page d’accueil
          </Button>
        </Link>
      </Pane>
    </Main>
  )
}

export default Custom404
