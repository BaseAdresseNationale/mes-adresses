import {useState} from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Position, IconButton, Pane} from 'evergreen-ui'

function MapButton({tooltipContent, ...buttonProps}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Pane onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} marginBottom={5}>
      <Tooltip isShown={!buttonProps.disabled && hovered} position={Position.LEFT} content={tooltipContent}>
        <IconButton
          {...buttonProps}
        />
      </Tooltip>
    </Pane>
  )
}

MapButton.propTypes = {
  tooltipContent: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  // eslint-disable-next-line react/boolean-prop-naming
  disabled: PropTypes.bool,
  icon: PropTypes.object.isRequired,
  intent: PropTypes.string,
  appearance: PropTypes.string
}

export default MapButton
