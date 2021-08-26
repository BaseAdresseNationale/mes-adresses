import React from 'react'
import {Pane, Heading, Button} from 'evergreen-ui'

const Redirection = () => {
  return (
    <Pane
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      padding={20}
    >
      <Heading marginBottom={15}>
        Vous voulez avoir une vue d&apos;ensemble de toutes les BAL publiées, y compris sur
        d&apos;autres outils ?
      </Heading>
      <Button
        appearance='primary'
        is='a'
        height={30}
        href='https://adresse.data.gouv.fr/bases-locales#map-stat'
        target='_blank'
        fontSize='0.8em'
      >
        État du déploiement des Bases Adresses Locales
      </Button>
    </Pane>
  )
}

export default Redirection
