import {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, Position, Icon} from 'evergreen-ui'

function Control({enabled, isDisabled, icon, enabledHint, disabledHint, onChange}) {
  const onToggle = useCallback(e => {
    e.stopPropagation()
    onChange(enabled => !enabled)
  }, [onChange])

  if (isDisabled) {
    return (
      <Pane is='button' className='mapboxgl-ctrl-icon mapboxgl-ctrl-enabled'>
        <Icon icon={icon} color='muted' />
      </Pane>
    )
  }

  return (
    <Tooltip
      position={Position.LEFT}
      content={enabled ? enabledHint : disabledHint}
    >
      <Pane
        is='button'
        className='mapboxgl-ctrl-icon mapboxgl-ctrl-enabled'
        onClick={onToggle}
      >
        <Icon icon={icon} color={isDisabled ? 'muted' : 'black'} />
      </Pane>
    </Tooltip>
  )
}

Control.propTypes = {
  enabled: PropTypes.bool,
  isDisabled: PropTypes.bool,
  icon: PropTypes.object.isRequired,
  enabledHint: PropTypes.string.isRequired,
  disabledHint: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

Control.defaultProps = {
  enabled: true,
  isDisabled: false,
}

export default Control
