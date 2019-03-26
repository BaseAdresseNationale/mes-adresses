import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, IconButton, Position} from 'evergreen-ui'

function NumeroSwitch({enabled, onChange}) {
  const onToggle = useCallback(e => {
    e.stopPropagation()
    onChange(enabled => !enabled)
  }, [onChange])

  return (
    <Pane
      position='absolute'
      display='flex'
      background='white'
      alignItems='center'
      top={88}
      right={16}
      zIndex={2}
      borderRadius={3}
    >
      <Tooltip position={Position.LEFT} content={enabled ? 'Masquer les numéros' : 'Afficher les numéros'}>
        <IconButton icon='numerical' isActive={enabled} background='white' onClick={onToggle} />
      </Tooltip>
    </Pane>
  )
}

NumeroSwitch.propTypes = {
  enabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

export default NumeroSwitch
