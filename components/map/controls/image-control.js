import PropTypes from 'prop-types'
import {Tooltip, Position, IconButton, CameraIcon} from 'evergreen-ui'

function ImageControl({handleTakeScreenshot}) {
  return (
    <Tooltip position={Position.LEFT} content='Capturer la carte'>
      <IconButton
        icon={CameraIcon}
        onClick={() => handleTakeScreenshot(true)}
      />
    </Tooltip>
  )
}

ImageControl.propTypes = {
  handleTakeScreenshot: PropTypes.func.isRequired,
}

export default ImageControl
