import {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInputField} from 'evergreen-ui'

import useFocus from '@/hooks/focus'

import AccentTool from '@/components/accent-tool'

function AssistedTextField({label, placeholder, value, validationMessage, onChange, isFocus, isDisabled}) {
  const [cursorPosition, setCursorPosition] = useState({start: 0, end: 0})
  const [focusRef, ref] = useFocus()

  const handleChangeAccent = e => {
    ref.focus()
    onChange(e)
    ref.setSelectionRange(cursorPosition.start, cursorPosition.end) // Put the cursor back to his position
  }

  const handleChangeInput = e => {
    ref.focus()
    onChange(e)
  }

  return (
    <Pane display='flex' alignItems={validationMessage ? 'last baseline' : 'flex-end'}>
      <TextInputField
        ref={isFocus && focusRef}
        required
        marginBottom={0}
        disabled={isDisabled}
        label={label}
        placeholder={placeholder}
        value={value}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
        onBlur={e => setCursorPosition({start: e.target.selectionStart, end: e.target.selectionEnd})}
        onChange={e => handleChangeInput(e)}
      />
      <Pane
        display='flex'
        flexDirection='column'
        justifyContent='center'
        marginLeft={8}
        marginTop={3}
      >
        <AccentTool input={value} handleAccent={e => handleChangeAccent(e)} cursorPosition={cursorPosition} />
      </Pane>
    </Pane>
  )
}

AssistedTextField.defaultProps = {
  placeholder: '',
  isFocus: false,
  isDisabled: false,
  validationMessage: null
}

AssistedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isFocus: PropTypes.bool,
  isDisabled: PropTypes.bool
}

export default AssistedTextField
