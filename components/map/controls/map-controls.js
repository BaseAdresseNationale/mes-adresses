import {useContext, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Alert, EyeOffIcon, EyeOpenIcon, AddIcon, CrossIcon, CompassIcon} from 'evergreen-ui'
import StyleControl from '@/components/map/controls/style-control'
import MapContext from '@/contexts/map'
import DrawContext from '@/contexts/draw'
import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'
import MapButton from './map-button'

function MapControls({commune, isLabelsDisplayed, setIsLabelsDisplayed, isAddressFormOpen, handleAddressForm}) {
  const [mapRotationDeg, setMapRotationDeg] = useState(180)
  const {style, setStyle, isCadastreDisplayed, setIsCadastreDisplayed, map, setViewport} = useContext(MapContext)
  const {hint} = useContext(DrawContext)
  const {
    voie,
    numeros,
    toponymes,
    isEditing
  } = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  useEffect(() => {
    if (!map) {
      return
    }

    const {angle} = map.transform
    const coef = 360 / (2 * Math.PI)

    // It looks better if the black arrow is pointing to the north
    setMapRotationDeg((angle * coef) - 180)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map?.transform.angle])

  const getShowHintsContent = () => {
    if (numeros) {
      return isLabelsDisplayed ? 'Masquer les détails' : 'Afficher les détails'
    }

    return isLabelsDisplayed ? 'Masquer les toponymes' : 'Afficher les toponymes'
  }

  const onCenterMap = () => {
    setViewport(currentViewport => ({
      ...currentViewport,
      pitch: 0,
      bearing: 0
    }))
    setMapRotationDeg(180)
  }

  const isRecenterButtonDisabled = Math.round(Math.abs(mapRotationDeg)) === 180

  return (
    <>
      <StyleControl
        style={style}
        handleStyle={setStyle}
        commune={commune}
        isCadastreDisplayed={isCadastreDisplayed}
        handleCadastre={setIsCadastreDisplayed}
      />

      <Pane
        position='absolute'
        top={100}
        right={15}
        zIndex={1}
        className='map-controls-buttons'
        display='flex'
        flexDirection='column'
      >
        {(voie || (toponymes && toponymes.length > 0)) && (
          <MapButton
            icon={isLabelsDisplayed ? EyeOffIcon : EyeOpenIcon}
            tooltipContent={getShowHintsContent()}
            onClick={() => setIsLabelsDisplayed(!isLabelsDisplayed)}
          />
        )}

        {token && (
          <MapButton
            tooltipContent={isAddressFormOpen ? 'Annuler' : 'Créer une adresse'}
            icon={isAddressFormOpen ? CrossIcon : AddIcon}
            disabled={isEditing && !isAddressFormOpen}
            onClick={() => handleAddressForm(!isAddressFormOpen)}
            intent={isAddressFormOpen ? '' : 'success'}
            appearance={isAddressFormOpen ? '' : 'primary'}
          />
        )}

        <MapButton
          tooltipContent='Réorienter la carte'
          icon={() => <CompassIcon style={{transform: `rotate(${mapRotationDeg}deg)`}} />}
          onClick={onCenterMap}
          disabled={isRecenterButtonDisabled}
        />
      </Pane>

      {hint && (
        <Pane
          zIndex={1}
          position='fixed'
          alignSelf='center'
          top={130}
        >
          <Alert title={hint} />
        </Pane>
      )}
    </>
  )
}

MapControls.propTypes = {
  commune: PropTypes.shape({
    hasOrtho: PropTypes.bool.isRequired
  }).isRequired,
  isLabelsDisplayed: PropTypes.bool.isRequired,
  setIsLabelsDisplayed: PropTypes.func.isRequired,
  isAddressFormOpen: PropTypes.bool.isRequired,
  handleAddressForm: PropTypes.func.isRequired
}

export default MapControls

