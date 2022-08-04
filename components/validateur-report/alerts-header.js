import PropTypes from 'prop-types'
import {Pane, WarningSignIcon, BanCircleIcon, MapMarkerIcon} from 'evergreen-ui'

import {filter, some, size} from 'lodash'

function AlertHeader({isVoie, voieAlerts, numerosWithAlerts, children}) {
  const hasVoieWarnings = some(voieAlerts, alert => alert.level === 'W')
  const hasVoieErrors = some(voieAlerts, alert => alert.level === 'E')

  const hasNumeroErrors = some(numerosWithAlerts, numero => size(filter(numero.alerts, {level: 'E'})) > 0)
  const hasNumeroWarnings = some(numerosWithAlerts, numero => size(filter(numero.alerts, {level: 'W'})) > 0)

  return (
    <Pane display='flex' gap={8} alignItems='center'>
      {isVoie ? (
        <Pane display='flex' gap={5}>
          {hasVoieErrors && <BanCircleIcon color='red500' size={22} />}
          {hasVoieWarnings && <WarningSignIcon color='orange500' size={22} />}
          {!hasVoieWarnings && !hasVoieErrors && <MapMarkerIcon size={22} />}
        </Pane>
      ) : (
        <Pane display='flex' gap={5}>
          {hasNumeroErrors && <BanCircleIcon color='red500' />}
          {hasNumeroWarnings && <WarningSignIcon color='orange500' /> }
        </Pane>
      )}

      {children}
    </Pane>
  )
}

AlertHeader.propTypes = {
  children: PropTypes.node.isRequired,
  voieAlerts: PropTypes.array,
  numerosWithAlerts: PropTypes.array,
  isVoie: PropTypes.bool
}

AlertHeader.defaultProps = {
  voieAlerts: [],
  numerosWithAlerts: []
}

export default AlertHeader
