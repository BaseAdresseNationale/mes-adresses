import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Badge, Text, Strong} from 'evergreen-ui'

function PopupFeatureNumero({feature, commune}) {
  const getParcelles = useMemo(() => {
    return feature.properties?.parcelles ? JSON.parse(feature.properties?.parcelles) : []
  }, [feature.properties])

  return (
    <Pane display='flex' flexDirection='column'>
      <Strong>{feature.properties.numero} {feature.properties.nomVoie}</Strong>
      <Text marginBottom='10px'>{commune.code} - {commune.nom}</Text>
      {(feature.properties.certifie) ? (
        <Badge color='green'>Certifié</Badge>
      ) : (
        <Badge color='yellow'>Non certifié</Badge>
      )}
      { getParcelles.length > 0 && (
        <>
          <Strong marginTop='10px'>Parcelle(s)</Strong>
          {getParcelles.map(parcelle => (
            <Badge key={parcelle} color='blue' marginTop={4}>
              {parcelle}
            </Badge>
          ))}
        </>
      )}
    </Pane>
  )
}

PopupFeatureNumero.propTypes = {
  feature: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired,
    properties: PropTypes.shape({
      numero: PropTypes.number.isRequired,
      nomVoie: PropTypes.string.isRequired,
      certifie: PropTypes.bool.isRequired,
      parcelles: PropTypes.string.isRequired,
    })
  }),
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
}

export default PopupFeatureNumero
