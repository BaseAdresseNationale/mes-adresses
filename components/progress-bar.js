import PropTypes from 'prop-types'
import {Pane, Text} from 'evergreen-ui'

function ProgressBar({percent}) {
  return (
    <Pane
      display='flex'
      marginTop={15}
    >
      <Pane
        flex={1}
        height={35}
        background='orange500'
        borderRadius={5}
      >
        <Pane
          display='flex'
          alignItems='center'
          height={35}
          width={`${percent}%`}
          borderRadius={5}
          background='green500'
        />
      </Pane>
      <Text
        display='flex'
        alignItems='center'
        justifyContent='center'
        paddingLeft='15px'
        size={500}
      >
        <b>{percent} %</b>
      </Text>
    </Pane>
  )
}

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired
}

export default ProgressBar
