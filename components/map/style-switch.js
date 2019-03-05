import React from 'react'
import {Pane, Image} from 'evergreen-ui'

function StyleSwitch({style, setStyle, offset}) {
  const toggleStyle = () => {
    if (style === 'ortho') {
      setStyle('vector')
    } else {
      setStyle('ortho')
    }
  }

  const otherStyle = style === 'ortho' ? 'vector' : 'ortho'

  return (
    <Pane
      position='absolute'
      display='flex'
      left={offset + 16}
      bottom={16}
      border='muted'
      elevation={2}
      zIndex={2}
      cursor='pointer'
      onClick={toggleStyle}
    >
      <Image
        display='block'
        src={`/static/images/preview-${otherStyle}.png`}
        width={72}
        height={72}
      />
    </Pane>
  )
}

export default StyleSwitch
