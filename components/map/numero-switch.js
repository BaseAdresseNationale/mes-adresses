import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, Icon, Position} from 'evergreen-ui'

function NumeroSwitch({enabled, icon, enabledHint, disabledHint, onChange}) {
  const onToggle = useCallback(e => {
    e.stopPropagation()
    onChange(enabled => !enabled)
  }, [onChange])

  return (
    <Pane
      position='absolute'
      top={88}
      right={16}
      zIndex={2}
      background={enabled ? '#e1e1e1' : null}
      className='mapboxgl-ctrl mapboxgl-ctrl-group'
    >
      <Tooltip
        position={Position.LEFT}
        content={enabled ? enabledHint : disabledHint}
      >
        <Pane
          is='button'
          className='mapboxgl-ctrl-icon mapboxgl-ctrl-enabled'
          onClick={onToggle}
        >
          <Icon icon={icon} size={18} />
        </Pane>
      </Tooltip>
    </Pane>
  )
}

NumeroSwitch.propTypes = {
  enabled: PropTypes.bool,
  icon: PropTypes.string,
  enabledHint: PropTypes.string,
  disabledHint: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

NumeroSwitch.defaultProps = {
  icon: 'map-marker',
  enabledHint: 'Masquer les numéros',
  disabledHint: 'Afficher les numéros'
}

export default NumeroSwitch
