import React from 'react'
import PropTypes from 'prop-types'
import {Popover, Button, Pane} from 'evergreen-ui'

const ACCENTS = [
  'à',
  'â',
  'é',
  'è',
  'ê',
  'ë',
  'î',
  'ï',
  'ô',
  'ö',
  'ù',
  'û',
  'ü',
  'ç',
  'œ',
  'À',
  'Â',
  'É',
  'È',
  'Ê',
  'Ë',
  'Î',
  'Ï',
  'Ô',
  'Ö',
  'Ù',
  'Û',
  'Ü',
  'Ç',
  'Œ'
]

function AccentTool({input, handleAccent}) {
  const handleClick = event => {
    event.target.value = `${input}${event.target.value}`
    handleAccent(event)
  }

  return (
    <Popover
      trigger='hover'
      content={
        <Pane width={250} height={242}>
          <Pane display='grid' gridTemplateColumns='repeat(auto-fit, minmax(34px, auto))' gridGap={10}>
            {ACCENTS.map(accent => (
              <Button key={accent} appearance='minimal' value={accent} onClick={handleClick}>
                {accent}
              </Button>
            ))}
          </Pane>
        </Pane>
      }
    >
      <Button type='button'>É</Button>
    </Popover>
  )
}

AccentTool.propTypes = {
  input: PropTypes.string.isRequired,
  handleAccent: PropTypes.func.isRequired
}

export default AccentTool
