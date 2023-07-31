import {useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Badge, Text, Strong} from 'evergreen-ui'
import BalDataContext from '@/contexts/bal-data'

function PopupFeatureNumero({feature, commune}) {
  const {voies} = useContext(BalDataContext)

  const getParcelles = useMemo(() => {
    return feature.properties?.parcelles ? JSON.parse(feature.properties?.parcelles) : []
  }, [feature.properties])

  const voie = useMemo(() => {
    return voies.find(v => v._id === feature.properties?.idVoie)
  }, [feature.properties?.idVoie, voies])

  return (
    <Pane display='flex' flexDirection='column'>
      <Strong>{feature.properties.numero} {feature.properties.suffixe} {voie?.nom}</Strong>
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
      idVoie: PropTypes.string.isRequired,
      numero: PropTypes.number.isRequired,
      certifie: PropTypes.bool.isRequired,
      parcelles: PropTypes.string.isRequired,
      suffixe: PropTypes.string,
    })
  }),
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
}

export default PopupFeatureNumero
