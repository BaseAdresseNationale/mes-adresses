import {Pane, Heading, Paragraph, Button} from 'evergreen-ui'
import Link from 'next/link'
import UploadForm from './upload-form'

function Index() {
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
        <Link href='/new' passHref>
          <Button marginTop={10} is='a'>
            Créer une nouvelle Base Adresse Locale à partir d’une commune
          </Button>
        </Link>
      </Pane>
    </>
  )
}

Index.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default Index
