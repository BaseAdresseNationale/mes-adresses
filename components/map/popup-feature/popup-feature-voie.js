import {useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Badge, Text, Strong} from 'evergreen-ui'
import BalDataContext from '@/contexts/bal-data'

function PopupFeatureVoie({feature, commune}) {
  const {voies} = useContext(BalDataContext)

  const voie = useMemo(() => {
    return voies.find(v => v._id === feature.properties?.id)
  }, [feature.properties?.id, voies])

  return (
    <Pane display='flex' flexDirection='column'>
      <Strong>{feature.properties.nom}</Strong>
      <Text marginBottom='10px'>{commune.code} - {commune.nom}</Text>
      {(voie.nbNumeros <= 0) ? (
        <Badge color='red'>Aucun numero</Badge>
      ) : ((voie.isAllCertified) ? (
        <Badge color='green'>Tous les numeros certifiés</Badge>
      ) : (
        <Badge color='yellow'>{voie.nbNumerosCertifies}/{voie.nbNumeros} certifié(s)</Badge>
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
      id: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
    })
  }),
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  })
}

export default PopupFeatureVoie
