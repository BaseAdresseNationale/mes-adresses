import {useState} from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Position, IconButton, Pane} from 'evergreen-ui'

function MapButton({tooltipContent, marginBottom, ...buttonProps}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Pane onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} marginBottom={marginBottom}>
      <Tooltip isShown={!buttonProps.disabled && hovered} position={Position.LEFT} content={tooltipContent}>
        <IconButton
          width={29}
          height={29}
          {...buttonProps}
        />
      </Tooltip>
    </Pane>
  )
}

MapButton.propTypes = {
  tooltipContent: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  marginBottom: PropTypes.number,
  // eslint-disable-next-line react/boolean-prop-naming
  disabled: PropTypes.bool,
  icon: PropTypes.object.isRequired,
  intent: PropTypes.string,
  appearance: PropTypes.string
}

export default MapButton
