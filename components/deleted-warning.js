import PropTypes from 'prop-types'
import {Pane, Text, WarningSignIcon} from 'evergreen-ui'

function DeletedWarning({baseLocale}) {
  return (
    <Pane
      width='100%'
      textAlign='center'
      backgroundColor='#d14343'
      color='#EEE'
      position='fixed'
      top={116}
      height={50}
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <WarningSignIcon size={20} marginX='.5em' verticalAlign='middle' />
      <Text color='#EEE'>
        La Base Adresse Locale &quot;{baseLocale.nom}&quot; a été supprimée, il n’est plus possible de la modifier.
      </Text>
    </Pane>
  )
}

DeletedWarning.propTypes = {
  baseLocale: PropTypes.shape({
    nom: PropTypes.string.isRequired,
  }).isRequired,
}

export default DeletedWarning
