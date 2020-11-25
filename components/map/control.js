import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, Position, IconButton} from 'evergreen-ui'

function Control({enabled, icon, enabledHint, disabledHint, onChange}) {
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
        <IconButton icon={icon} />
      </Pane>
    </Tooltip>
  )
}

Control.propTypes = {
  enabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  enabledHint: PropTypes.string.isRequired,
  disabledHint: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

Control.defaultProps = {
  enabled: true
}

export default Control
