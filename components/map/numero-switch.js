import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, Icon, Position} from 'evergreen-ui'

function NumeroSwitch({enabled, onChange}) {
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
        content={enabled ? 'Masquer les numéros' : 'Afficher les numéros'}
      >
        <Pane
          is='button'
          className='mapboxgl-ctrl-icon mapboxgl-ctrl-enabled'
          onClick={onToggle}
        >
          <Icon icon='numerical' size={18} />
        </Pane>
      </Tooltip>
    </Pane>
  )
}

NumeroSwitch.propTypes = {
  enabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

export default NumeroSwitch
