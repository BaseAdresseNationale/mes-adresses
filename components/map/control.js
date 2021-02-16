import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Tooltip, Position, IconButton} from 'evergreen-ui'

function Control({enabled, icon, enabledHint, disabledHint, onChange, disabled}) {
  const onToggle = useCallback(e => {
    e.stopPropagation()
    onChange(enabled => !enabled)
  }, [onChange])

  return (
    <>
      <Tooltip
        position={Position.LEFT}
        isShown={disabled ? false : null}
        content={enabled ? enabledHint : disabledHint}
      >
        <Pane
          className='mapboxgl-ctrl-icon mapboxgl-ctrl-enabled'
          padding={0}
          onClick={disabled ? null : onToggle}
        >
          <IconButton icon={icon} opacity={`${disabled ? '0.7' : null}`} />
        </Pane>
      </Tooltip>
      {/* Unifying MapboxGL and Evergreen style */}
      <style jsx global>{`
        .ub-w_14px.ub-h_14px.ub-box-szg_border-box {
          fill: black !important;
        }
      `}</style>
    </>
  )
}

Control.propTypes = {
  enabled: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  enabledHint: PropTypes.string.isRequired,
  disabledHint: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

Control.defaultProps = {
  enabled: true,
  disabled: false
}

export default Control
