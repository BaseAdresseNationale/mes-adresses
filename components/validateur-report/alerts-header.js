import PropTypes from 'prop-types'
import {Pane, WarningSignIcon, BanCircleIcon, MapMarkerIcon, InfoSignIcon} from 'evergreen-ui'

function AlertHeader({isVoie, hasErrors, hasWarnings, hasInfos, children}) {
  const hasVoieNoAlerts = !hasWarnings && !hasErrors && !hasInfos

  return (
    <Pane display='flex' gap={8} alignItems='center'>
      <Pane display='flex' gap={5} >
        {hasErrors && <BanCircleIcon color='red500' size={isVoie ? 22 : 16} />}
        {hasWarnings && <WarningSignIcon color='orange500' size={isVoie ? 22 : 16} />}
        {hasInfos && <InfoSignIcon color='blue500' size={isVoie ? 22 : 16} />}
        {hasVoieNoAlerts && <MapMarkerIcon size={22} />}
      </Pane>
      {children}
    </Pane>
  )
}

AlertHeader.propTypes = {
  children: PropTypes.node.isRequired,
  isVoie: PropTypes.bool,
  hasErrors: PropTypes.bool,
  hasWarnings: PropTypes.bool,
  hasInfos: PropTypes.bool
}

AlertHeader.defaultProps = {
  isVoie: false,
  hasErrors: false,
  hasWarnings: false,
  hasInfos: false
}

export default AlertHeader
