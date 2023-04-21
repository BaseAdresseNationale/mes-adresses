import PropTypes from 'prop-types'
import {Heading, Pane, Text} from 'evergreen-ui'

function Counter({label, value, color}) {
  return (
    <Pane
      display='flex'
      flexDirection='column'
      alignItems='center'
      paddingX={5}
      paddingY={10}
      margin={5}
      width='100%'
    >
      <Heading size={600} color={color}>{value}</Heading>
      <Text fontSize='.9em' marginTop={4}>{label}</Text>
    </Pane>
  )
}

Counter.defaultProps = {
  color: null,
}

Counter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
}

export default Counter
