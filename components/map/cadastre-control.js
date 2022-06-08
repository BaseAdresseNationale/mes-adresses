import PropTypes from 'prop-types'
import {Tooltip, Button, ControlIcon} from 'evergreen-ui'

function CadastreControl({hasCadastre, isCadastreDisplayed, onClick}) {
  return (
    hasCadastre ? (
      <Tooltip content={isCadastreDisplayed ? 'Masquer le cadastre' : 'Afficher le cadastre'}>
        <Button style={{padding: '.8em'}} onClick={onClick}>
          <ControlIcon color={isCadastreDisplayed ? 'selected' : 'muted'} />
        </Button>
      </Tooltip>
    ) : (
      <Tooltip content='Le cadastre n’est pas disponible pour cette commune'>
        <Button style={{padding: '.8em'}}>
          <ControlIcon color='muted' />
        </Button>
      </Tooltip>
    )
  )
}

CadastreControl.propTypes = {
  hasCadastre: PropTypes.bool.isRequired,
  isCadastreDisplayed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default CadastreControl
