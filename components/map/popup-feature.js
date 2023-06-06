import {useState, useCallback, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import MapGl, {Source, Layer, Popup} from 'react-map-gl'
import {Pane, Badge, Text} from 'evergreen-ui'

function PopupFeature({feature, commune}) {

  console.log(feature)
  const getParcelles = useMemo(() => {
    return feature.properties?.parcelles ? JSON.parse(feature.properties?.parcelles) : []
  }, [feature.properties])

  return (
    <Popup 
      longitude={feature.geometry.coordinates[0]}
      latitude={feature.geometry.coordinates[1]}
      closeButton={false}
      anchor="bottom"
      style='padding:5px; margin:5px;'
    >
      {feature.sourceLayer === 'voies' ? (
        <Pane display='flex' flexDirection='column'>
          <Text>{feature.properties.nomVoie}</Text>
          <Text>{commune.code} - {commune.nom}</Text>
          {/* NBR DE NUMERO */}
          {/* CERTIFICATION */}
        </Pane>
      ) : feature.sourceLayer === 'numeros' ? (
        <Pane display='flex' flexDirection='column'>
          <Text>{feature.properties.numero} {feature.properties.nomVoie}</Text>
          <Text>{commune.code} - {commune.nom}</Text>
          {getParcelles.map(parcelle => 
            <Badge key={parcelle} color='green' marginTop={4}>
              {parcelle}
            </Badge>
          )}
          {/* CERTIFICATION */}
        </Pane>
      ) : (
        <p>Other</p>
      )}
    </Popup>
  )
}

PopupFeature.propTypes = {
  feature: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired,
  }),
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
  //   certifie: PropTypes.bool.isRequired,
  //   numeroComplet: PropTypes.string,
  //   numero: PropTypes.number.isRequired,
  //   suffixe: PropTypes.string,
  //   positions: PropTypes.arrayOf(PropTypes.shape({
  //     geometry: PropTypes.shape({
  //       coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
  //     }).isRequired,
  //     type: PropTypes.string
  //   }))
  // }).isRequired,
  // style: PropTypes.object.isRequired,
  // isContextMenuDisplayed: PropTypes.bool,
  // onEnableEditing: PropTypes.func.isRequired,
  // removeAddress: PropTypes.func.isRequired
}

PopupFeature.defaultProps = {
  // isContextMenuDisplayed: false
}

export default PopupFeature
