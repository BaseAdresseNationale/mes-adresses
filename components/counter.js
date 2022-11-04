import PropTypes from 'prop-types'
import {Heading, Text} from 'evergreen-ui'

function Counter({label, value, hasBorder, color, hasBigLabel}) {
  return (
    <div className={`counter ${hasBorder ? 'border' : ''}`}>
      <Heading size={900} color={color}>{value}</Heading>
      <Text fontSize={`${hasBigLabel ? '1.3em' : '.9em'}`} marginTop={4}>{label}</Text>
      <style jsx>{`
        .counter {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px .5em;
          margin: 5px;
          width: 100%;
        }

        .border {
          border: 4px solid #2053b3;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

Counter.defaultProps = {
  hasBorder: false,
  color: null,
  hasBigLabel: false
}

Counter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  hasBorder: PropTypes.bool,
  color: PropTypes.string,
  hasBigLabel: PropTypes.bool
}

export default Counter
