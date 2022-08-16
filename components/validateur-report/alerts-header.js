import PropTypes from 'prop-types'
import {Pane, WarningSignIcon, BanCircleIcon, MapMarkerIcon, InfoSignIcon} from 'evergreen-ui'

function AlertHeader({size, hasErrors, hasWarnings, hasInfos, children}) {
  const hasVoieNoAlerts = !hasWarnings && !hasErrors && !hasInfos

  return (
    <Pane display='flex' gap={8} alignItems='center'>
      <Pane display='flex' gap={5} >
        {hasVoieNoAlerts ? <MapMarkerIcon size={size} /> : (
          <>
            {hasErrors && <BanCircleIcon color='red500' size={size} />}
            {hasWarnings && <WarningSignIcon color='orange500' size={size} />}
            {hasInfos && <InfoSignIcon color='blue500' size={size} />}
          </>
        )}
      </Pane>
      {children}
    </Pane>
  )
}

AlertHeader.propTypes = {
  children: PropTypes.node.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  hasWarnings: PropTypes.bool.isRequired,
  hasInfos: PropTypes.bool.isRequired,
  size: PropTypes.number
}

AlertHeader.defaultProps = {
  size: 16,
}

export default AlertHeader
