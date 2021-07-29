import React from 'react'
import PropTypes from 'prop-types'
import {Label, Tooltip, HelpIcon} from 'evergreen-ui'

function InputLabel({title, help}) {
  return (
    <Label marginTop={8} marginBottom={4}>
      {title} {help && (
        <Tooltip content={help}>
          <HelpIcon marginLeft={4} verticalAlign='middle' />
        </Tooltip>
      )}
    </Label>
  )
}

InputLabel.defaultProps = {
  help: null,
}

InputLabel.propTypes = {
  title: PropTypes.string.isRequired,
  help: PropTypes.string,
}

export default InputLabel
