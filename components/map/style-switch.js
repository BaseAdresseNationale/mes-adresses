import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Image} from 'evergreen-ui'

const styleSwitchMap = {
  ortho: 'vector',
  vector: 'ortho'
}

function StyleSwitch({style, setStyle}) {
  const toggleStyle = useCallback(() => {
    setStyle(styleSwitchMap[style])
  }, [style, setStyle])

  return (
    <Pane
      position='absolute'
      display='flex'
      left={16}
      bottom={16}
      border='muted'
      elevation={2}
      zIndex={2}
      cursor='pointer'
      onClick={toggleStyle}
    >
      <Image
        display='block'
        src={`/static/images/preview-${styleSwitchMap[style]}.png`}
        width={72}
        height={72}
      />
    </Pane>
  )
}

StyleSwitch.propTypes = {
  style: PropTypes.oneOf([
    'ortho',
    'vector'
  ]).isRequired,
  setStyle: PropTypes.func.isRequired
}

export default StyleSwitch
