import PropTypes from 'prop-types'
import {Popup} from 'react-map-gl'
import PopupFeatureVoie from './popup-feature-voie'
import PopupFeatureNumero from './popup-feature-numero'
import {LAYERS_SOURCE} from '@/components/map/layers/tiles'

function PopupFeature({feature, commune}) {
  return (
    <Popup
      longitude={feature.geometry.coordinates[0]}
      latitude={feature.geometry.coordinates[1]}
      closeButton={false}
      anchor='bottom'
    >
      {(feature.sourceLayer === LAYERS_SOURCE.VOIES_POINTS) && (
        <PopupFeatureVoie feature={feature} commune={commune} />
      )}
      {(feature.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS) && (
        <PopupFeatureNumero feature={feature} commune={commune} />
      )}
    </Popup>
  )
}

PopupFeature.propTypes = {
  feature: PropTypes.shape({
    sourceLayer: PropTypes.string.isRequired,
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired,
  }),
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
}

export default PopupFeature
