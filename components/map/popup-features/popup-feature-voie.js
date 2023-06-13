import PropTypes from 'prop-types'
import {Pane, Badge, Text, Strong} from 'evergreen-ui'

function PopupFeatureVoie({feature, commune}) {
  return (
    <Pane display='flex' flexDirection='column'>
      <Strong>{feature.properties.nomVoie}</Strong>
      <Text marginBottom='10px'>{commune.code} - {commune.nom}</Text>
      {(feature.properties.nbNumero) <= 0 ? (
        <Badge color='red'>Aucun numero</Badge>
      ) : ((feature.properties.nbNumero === feature.properties.nbNumeroCertifie) ? (
        <Badge color='green'>Tous les numeros certifiés</Badge>
      ) : (
        <Badge color='yellow'>{feature.properties.nbNumeroCertifie}/{feature.properties.nbNumero} certifié(s)</Badge>
      ))}
    </Pane>
  )
}

PopupFeatureVoie.propTypes = {
  feature: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired,
    properties: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      nbNumero: PropTypes.number.isRequired,
      nbNumeroCertifie: PropTypes.number.isRequired,
    })
  }),
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
}

export default PopupFeatureVoie
