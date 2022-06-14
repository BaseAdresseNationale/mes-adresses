import {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, SelectMenu, Button, Position, LayersIcon} from 'evergreen-ui'

import CadastreControl from '@/components/map/controls/cadastre-control.js'

function StyleControl({style, commune, handleStyle, isCadastreDisplayed, handleCadastre}) {
  const [showPopover, setShowPopover] = useState(false)

  const availableStyles = useMemo(() => {
    const {hasOrtho, hasOpenMapTiles, hasPlanIGN} = commune
    return [
      {label: 'Plan OpenMapTiles', value: 'vector', isAvailable: hasOpenMapTiles},
      {label: 'Plan IGN (Bêta)', value: 'plan-ign', isAvailable: hasPlanIGN},
      {label: 'Photographie aérienne', value: 'ortho', isAvailable: hasOrtho}
    ].filter(({isAvailable}) => isAvailable)
  }, [commune])

  return (
    <Pane
      position='absolute'
      display='flex'
      left={22}
      bottom={22}
      border='none'
      elevation={2}
      zIndex={2}
      cursor='pointer'
      onClick={() => setShowPopover(!showPopover)}
    >
      {availableStyles.length > 1 ? (
        <SelectMenu
          closeOnSelect
          position={Position.TOP_LEFT}
          title='Choix du fond de carte'
          hasFilter={false}
          height={40 + (33 * availableStyles.length)}
          options={availableStyles}
          selected={style}
          onSelect={style => handleStyle(style.value)}
        >
          <Button className='map-style-button' style={{borderRadius: '3px 0 0 3px'}}>
            <LayersIcon style={{marginRight: '.5em', borderRadius: '0 3px 3px 0'}} />
            <div className='map-style-label'>{availableStyles.find(({value}) => value === style).label}</div>
          </Button>

        </SelectMenu>
      ) : (
        <Button className='map-style-button' style={{borderRadius: '3px 0 0 3px'}}>
          <LayersIcon style={{marginRight: '.5em', borderRadius: '0 3px 3px 0'}} />
          <div className='map-style-label'>{availableStyles[0].label}</div>
        </Button>
      )}
      <CadastreControl
        hasCadastre={commune.hasCadastre}
        isCadastreDisplayed={isCadastreDisplayed}
        onClick={() => handleCadastre(show => !show)}
      />
    </Pane>
  )
}

StyleControl.propTypes = {
  style: PropTypes.string.isRequired,
  handleStyle: PropTypes.func.isRequired,
  isCadastreDisplayed: PropTypes.bool.isRequired,
  handleCadastre: PropTypes.func.isRequired,
  commune: PropTypes.shape({
    hasCadastre: PropTypes.bool.isRequired,
    hasOpenMapTiles: PropTypes.bool.isRequired,
    hasOrtho: PropTypes.bool.isRequired,
    hasPlanIGN: PropTypes.bool.isRequired
  }).isRequired
}

export default StyleControl
