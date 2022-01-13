import {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, SelectMenu, Button, Position, Tooltip, LayersIcon, ControlIcon} from 'evergreen-ui'

const STYLES = [
  {label: 'Plan', value: 'vector'},
  {label: 'Plan IGN(Version Bêta)', value: 'planIGN'},
  {label: 'Photographie aérienne', value: 'ortho'}
  
]

function StyleSelector({style, isFormOpen, handleStyle, isCadastreDisplayed, handleCadastre}) {
  const [showPopover, setShowPopover] = useState(false)

  return (
    <Pane
      position='absolute'
      display='flex'
      left={16}
      bottom={isFormOpen ? 410 : 16}
      border='none'
      elevation={2}
      zIndex={2}
      cursor='pointer'
      onClick={() => setShowPopover(!showPopover)}
    >
      <SelectMenu
        closeOnSelect
        position={Position.TOP_LEFT}
        title='Choix du fond de carte'
        hasFilter={false}
        height={110}
        options={STYLES}
        selected={style}
        onSelect={style => handleStyle(style.value)}
      >
        <Button className='map-style-button' style={{borderRadius: '3px 0 0 3px'}}>
          <LayersIcon style={{marginRight: '.5em', borderRadius: '0 3px 3px 0'}} />
          <div className='map-style-label'>{STYLES.find(({value}) => value === style).label}</div>
        </Button>

      </SelectMenu>
      <Tooltip content={isCadastreDisplayed ? 'Masquer le cadastre' : 'Afficher le cadastre'}>
        <Button style={{padding: '.8em'}} onClick={() => handleCadastre(show => !show)}>
          <ControlIcon color={isCadastreDisplayed ? 'selected' : 'muted'} />
        </Button>
      </Tooltip>
    </Pane>
  )
}

StyleSelector.propTypes = {
  style: PropTypes.string.isRequired,
  isFormOpen: PropTypes.bool.isRequired,
  handleStyle: PropTypes.func.isRequired,
  isCadastreDisplayed: PropTypes.bool.isRequired,
  handleCadastre: PropTypes.func.isRequired
}

export default StyleSelector
