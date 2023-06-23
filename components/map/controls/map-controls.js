import {useContext, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Alert, EyeOffIcon, EyeOpenIcon, AddIcon, CrossIcon, CompassIcon} from 'evergreen-ui'
import StyleControl from '@/components/map/controls/style-control'
import MapContext from '@/contexts/map'
import DrawContext from '@/contexts/draw'
import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'
import MapButton from './map-button'

// It looks better if the black arrow is pointing to the north
const DEFAULT_COMPASS_BEARING = 180
const DEFAULT_COMPASS_PITCH = 0

function MapControls({commune, isLabelsDisplayed, setIsLabelsDisplayed, isAddressFormOpen, handleAddressForm}) {
  const [compassTransform, setCompassTransform] = useState({
    bearing: DEFAULT_COMPASS_BEARING,
    pitch: DEFAULT_COMPASS_PITCH
  })
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

    const pitch = map.getPitch()
    const bearing = map.getBearing()

    setCompassTransform({
      bearing: DEFAULT_COMPASS_BEARING - bearing,
      pitch: DEFAULT_COMPASS_PITCH - pitch
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map?.transform.pitch, map?.transform.bearing])

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
    setCompassTransform({
      bearing: DEFAULT_COMPASS_BEARING,
      pitch: DEFAULT_COMPASS_PITCH
    })
  }

  const isRecenterButtonDisabled =
    Math.abs(Math.round(compassTransform.bearing)) === DEFAULT_COMPASS_BEARING &&
    Math.abs(Math.round(compassTransform.pitch)) === DEFAULT_COMPASS_PITCH

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
        top={90}
        right={16}
        zIndex={1}
        className='map-controls-buttons'
        display='flex'
        flexDirection='column'
      >
        <MapButton
          tooltipContent='Réorienter la carte'
          icon={() => <CompassIcon style={{transform: `rotate(${compassTransform.bearing}deg)`}} />}
          onClick={onCenterMap}
          disabled={isRecenterButtonDisabled}
          marginBottom={15}
        />

        {(voie || (toponymes && toponymes.length > 0)) && (
          <MapButton
            icon={isLabelsDisplayed ? EyeOffIcon : EyeOpenIcon}
            tooltipContent={getShowHintsContent()}
            onClick={() => setIsLabelsDisplayed(!isLabelsDisplayed)}
            marginBottom={5}
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

