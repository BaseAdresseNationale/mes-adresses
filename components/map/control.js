import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, Icon, Position} from 'evergreen-ui'

function NumeroSwitch({enabled, icon, enabledHint, disabledHint, onChange}) {
  const onToggle = useCallback(e => {
    e.stopPropagation()
    onChange(enabled => !enabled)
  }, [onChange])

  return (
    <Tooltip
      position={Position.LEFT}
      background={enabled ? '#e1e1e1' : null}
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
  )
}

NumeroSwitch.propTypes = {
  enabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  enabledHint: PropTypes.string.isRequired,
  disabledHint: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

NumeroSwitch.defaultProps = {
  enabled: true
}

export default NumeroSwitch
