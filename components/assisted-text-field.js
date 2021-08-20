import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInputField} from 'evergreen-ui'

import useFocus from '../hooks/focus'

import AccentTool from './accent-tool'

function AssistedTextField({label, placeholder, value, onChange, focus, disabled}) {
  const [cursorPosition, setCursorPosition] = useState({start: 0, end: 0})
  const focusRef = useFocus()

  return (
    <Pane display='flex'>
      <TextInputField
        ref={focus && focusRef}
        required
        disabled={disabled}
        label={label}
        placeholder={placeholder}
        value={value}
        onBlur={e => setCursorPosition({start: e.target.selectionStart, end: e.target.selectionEnd})}
        onChange={onChange}
      />
      <Pane
        display='flex'
        flexDirection='column'
        justifyContent='center'
        marginLeft={8}
        marginTop={3}
      >
        <AccentTool input={value} handleAccent={onChange} cursorPosition={cursorPosition} />
      </Pane>
    </Pane>
  )
}

AssistedTextField.defaultProps = {
  placeholder: '',
  focus: false,
  disabled: false
}

AssistedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  focus: PropTypes.bool,
  disabled: PropTypes.bool
}

export default AssistedTextField
