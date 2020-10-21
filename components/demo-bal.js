import React from 'react'
import Router from 'next/router'
import {Pane, Text, Button} from 'evergreen-ui'

const DemoBal = () => {
  return (
    <Pane display='flex' flexDirection='column' alignItems='center' justifyContent='center' backgroundColor='#0053b3' height='115px' padding='1em' flexShrink='0'>
      <Text color='snow'>
        Vous voulez simplement essayer l’éditeur, sans créer de Base Adresse Locale ?
      </Text>
      <Pane marginTop='1em'>
        <Button onClick={() => Router.push('/new?test=1')}>Cliquez ici</Button>
      </Pane>
    </Pane>
  )
}

export default DemoBal
