import PropTypes from 'prop-types'
import {Pane, Heading, Alert, Text, Strong} from 'evergreen-ui'

import AuthenticatedUser from './authenticated-user'

function AcceptedDialog({commune, strategy, expiresAt}) {
  const {nomNaissance, nomMarital, prenom, typeMandat} = strategy.mandat || {}

  return (
    <Pane>
      <Pane display='flex' justifyContent='space-between' marginTop={16} gap={32}>
        <Pane display='flex' flexDirection='column' justifyContent='center' textAlign='center' width='30%'>
          <Heading is='h3' marginBottom={8}>Vous êtes identifié comme :</Heading>
          {strategy.mandat ? (
            <AuthenticatedUser type='elu' title={`${prenom} ${nomMarital || nomNaissance}`} subtitle={typeMandat.replace(/-/g, ' ')} />
          ) : (
            <AuthenticatedUser type='mairie' title='La mairie de' subtitle={`${commune.nom} (${commune.code})`} />
          )}
        </Pane>

        <Alert title='Votre Base Locale a bien été habilitée !' intent='success'>
          <Pane display='flex' flexDirection='column'>
            <Text marginTop={8} size={400}>
              Cette habilitation vous permet désormais de <Strong>publier et de mettre à jour dans la Base Adresses Nationale</Strong> les adresses de la commune de <Strong>{commune.nom}</Strong> via cette Base Adresses Locales.
            </Text>
            <Text marginTop={8} size={400}>
              Cette habilitation, expirera le <Strong size={400}>{new Date(expiresAt).toLocaleDateString()}</Strong>. Après cette date, vous serez invité à demander une nouvelle habilitation.
            </Text>
          </Pane>
        </Alert>
      </Pane>
    </Pane>
  )
}

AcceptedDialog.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  expiresAt: PropTypes.string.isRequired,
  strategy: PropTypes.shape({
    mandat: PropTypes.shape({
      nomNaissance: PropTypes.string.isRequired,
      nomMarital: PropTypes.string,
      prenom: PropTypes.string.isRequired,
      typeMandat: PropTypes.oneOf([
        'maire',
        'maire-delegue',
        'adjoint-au-maire',
        'conseiller-municipal',
        'administrateur'
      ])
    }),
  })
}

export default AcceptedDialog
