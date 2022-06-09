import PropTypes from 'prop-types'
import {Dialog, Pane, Heading, Strong, Paragraph, InlineAlert, Alert} from 'evergreen-ui'

function COMDialog({baseLocaleId, handleClose}) {
  return (
    <Dialog
      isShown
      width={1200}
      preventBodyScrolling
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={handleClose}
    >
      <Pane display='flex' flexDirection='column' marginY={16}>
        <Heading size={700} textAlign='center' marginBottom={8}>Publication de votre Base Adresse Locale</Heading>
        <InlineAlert intent='warning' marginY={16}>
          Votre commune fait partie des Collectivités d’Outre-Mer pour lesquelles une authentification automatique est en cours de développement.
        </InlineAlert>

        <Alert intent='none' title='Merci de nous contacter'>
          <Paragraph marginTop={8}>Dans l’attente, afin de pouvoir publier vos adresses dans la <Strong>Base Adresse Nationale</Strong>, vous devez nous contacter à l’adresse : <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>.</Paragraph>
          <Paragraph>Dans votre courriel, veuillez nous indiquer l’identifiant de votre Base Adresse Locale <Strong>({baseLocaleId})</Strong>.</Paragraph>
        </Alert>
      </Pane>
    </Dialog>
  )
}

COMDialog.propTypes = {
  baseLocaleId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default COMDialog
