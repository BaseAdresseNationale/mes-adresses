import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'

const Counter = ({label, value, color}) => {
  return (
    <Pane marginY={16} marginX='auto' textAlign='center'>
      <Heading size={700} color={color}>
        {value}
      </Heading>
      <Heading size={500} fontWeight={300} color='muted'>
        {label}
      </Heading>
    </Pane>
  )
}

Counter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
}

Counter.defaultProps = {
  color: '#222',
}

export default Counter
