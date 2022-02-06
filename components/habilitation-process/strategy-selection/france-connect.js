import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Heading, Strong, Text, UnorderedList, ListItem} from 'evergreen-ui'

function FranceConnect({isDisabled, handleStrategy}) {
  return (
    <>
      <Pane>
        <Heading is='h5' marginBottom={8}>M’authentifier comme élu</Heading>
        <Pane className='fc-disabled' cursor={isDisabled ? 'not-allowed' : 'pointer'} onClick={isDisabled ? null : handleStrategy}>
          <NextImage
            width={280}
            height={72}
            src='/static/images/FCboutons-10.svg'
            alt='bouton FranceConnect'
          />
        </Pane>
        {isDisabled && <Text color='muted'>(Actuellement indisponible)</Text>}
      </Pane>

      {!isDisabled && (
        <>
          <Pane>
            <Heading textAlign='center' color='#225DF5'>Pourquoi utiliser FranceConnect ?</Heading>
            <UnorderedList textAlign='left'>
              <ListItem>
                Permet de s’authentifier de façon <Strong>simple</Strong> et <Strong>sécurisée</Strong>.
              </ListItem>
              <ListItem>
                Vous serez automatiquement reconnu(e) comme <Strong>élu(e)</Strong> (maire, adjoint(e) ou conseiller(e)) de <Strong>votre commune</Strong>.
              </ListItem>
              <ListItem>
                Vous aurez la possibilité de vous identifier via <Strong>le service de votre choix</Strong> (impots.gouv.fr, ameli.fr etc...).
              </ListItem>
            </UnorderedList>
          </Pane>

          <Text textDecoration='underline'>
            <Strong>Aucune donnée personnelle ne nous sera transmise durant ce processus d’authentification</Strong>
          </Text>
        </>
      )}
    </>
  )
}

FranceConnect.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  handleStrategy: PropTypes.func.isRequired
}

export default FranceConnect
