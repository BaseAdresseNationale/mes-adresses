import React, {useCallback} from 'react'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Button} from 'evergreen-ui'

import UploadForm from './upload-form'

function Index() {
  const onCreateNew = useCallback(() => {
    Router.push('/new')
  }, [])

  return (
    <>
      <Pane borderBottom padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Pour être éditable à l’aide de cet outil, votre fichier doit être conforme au modèle BAL 1.1 de l’AITF.
        </Paragraph>
      </Pane>

      <UploadForm />

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez créer une nouvelle Base Adresse Locale à partir de la commune de votre choix.
        </Paragraph>
        <Button marginTop={10} onClick={onCreateNew}>
          Créer une nouvelle Base Adresse Locale à partir d’une commune
        </Button>
      </Pane>
    </>
  )
}

export default Index
