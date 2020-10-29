import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Paragraph} from 'evergreen-ui'

const Counter = ({label, value, color, size}) => {
  return (
    <Pane width={100} margin={10} textAlign='center' elevation={1} border='default'>
      <Paragraph fontSize={size} fontWeight='bold' color={color}>
        {value}
      </Paragraph>
      <Paragraph color={color}>
        {label}
      </Paragraph>
    </Pane>
  )
}

Counter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
  size: PropTypes.number.isRequired
}

Counter.defaultProps = {
  color: 'black'
}

export default Counter
