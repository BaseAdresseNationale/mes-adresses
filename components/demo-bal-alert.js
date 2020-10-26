import React from 'react'
import Router from 'next/router'
import {Pane, Text, Button, Alert} from 'evergreen-ui'

const DemoBALAlert = () => {
  return (
    <Pane padding='22px'>
      <Alert>
        <Text>
          Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?
        </Text>
        <Button appearance='primary' marginLeft='1em' onClick={() => Router.push('/new?test=1')}>Cliquez ici</Button>
      </Alert>
    </Pane>
  )
}

export default DemoBALAlert
