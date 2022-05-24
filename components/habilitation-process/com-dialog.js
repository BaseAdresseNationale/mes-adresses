import PropTypes from 'prop-types'
import {Pane, Heading, Strong, Paragraph} from 'evergreen-ui'

function COMDialog({baseLocaleId}) {
  return (
    <Pane display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginY={16}>
      <Heading marginBottom={8} textAlign='center' color='#225DF5'>Publication de votre Base Adresse Locale</Heading>
      <Paragraph>
        Votre commune fait partie des Collectivités d’Outre-Mer pour lesquelles une authentification automatique est en cours de développement.
      </Paragraph>
      <Paragraph textAlign='center'>
        Dans l’attente, afin de pouvoir publier vos adresses dans la <Strong>Base Adresse Nationale</Strong>, vous devez nous contacter sur <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>.
      </Paragraph>
      <Paragraph textAlign='center'>
        Dans votre courriel, veuillez nous indiquer l’identifiant de votre <Strong>Base Adresse Locale</Strong> ({baseLocaleId}).
      </Paragraph>
      <Paragraph textAlign='center'>
        Merci de nous contacter.
      </Paragraph>
    </Pane>
  )
}

COMDialog.propTypes = {
  baseLocaleId: PropTypes.string.isRequired
}

export default COMDialog
