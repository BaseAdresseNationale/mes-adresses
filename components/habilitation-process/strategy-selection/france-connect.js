import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Heading, Tooltip, Strong, Text, HelpIcon} from 'evergreen-ui'

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
          <Text marginTop={8} size={400}>
            Cette méthode permet de <Strong>vous identifer de façon simple et sécurisé</Strong> en comparant automatiquement votre
            <Pane display='inline-flex' alignItems='center' marginX={4}>
              <Text size={400} borderBottom='1px dashed #474d66'>identitée pivot</Text><Tooltip content='L’ensemble des informations nécessaires pour identifier une personne unique'>
                <HelpIcon marginLeft={4} />
              </Tooltip>
            </Pane>
            avec le <Strong>Registre Nationale des Élus</Strong>.
          </Text>
          <Text marginTop={8} size={400}>
            Vous serez alors reconnue comme élu (maire, adjoint ou conseiller) de cette commune.
          </Text>
          <Text marginTop={8} size={400}>
            Pour ce faire, FranceConnect vous invitera à <Strong>vous identifiez via le service de votre choix</Strong> (impots.gouv.fr, ameli.fr, etc…).
          </Text>
          <Text marginTop={8} size={400}>
            <Strong textDecoration='underline'>Aucune donnée personnelle ne nous sera transmise durant ce processus.</Strong>
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
