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

function AccentTool({input, handleAccent, cursorPosition}) {
  const stringArray = input.split('')
  const {start, end} = cursorPosition

  const handleClick = event => {
    stringArray.splice(start, end - start, event.target.value)
    event.target.value = stringArray.join('')
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
  handleAccent: PropTypes.func.isRequired,
  cursorPosition: PropTypes.objectOf(PropTypes.number).isRequired
}

export default AccentTool
