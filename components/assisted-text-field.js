import {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInputField} from 'evergreen-ui'

import useFocus from '@/hooks/focus'

import AccentTool from '@/components/accent-tool'

function AssistedTextField({label, ariaLabel, placeholder, value, validationMessage, onChange, isFocus, isDisabled, isRequired, isFullWidth}) {
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
    <Pane display='flex' alignItems={validationMessage ? 'last baseline' : 'flex-end'} marginBottom='1em'>
      <TextInputField
        ref={isFocus && focusRef}
        required={isRequired}
        marginBottom={0}
        disabled={isDisabled}
        label={label}
        placeholder={placeholder}
        value={value}
        aria-label={ariaLabel}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
        onBlur={e => setCursorPosition({start: e.target.selectionStart, end: e.target.selectionEnd})}
        onChange={e => handleChangeInput(e)}
        width={isFullWidth ? '100%' : ''}
      />
      <Pane
        display='flex'
        flexDirection='column'
        justifyContent='center'
        marginLeft={8}
        marginTop={3}
      >
        <AccentTool input={value} handleAccent={e => handleChangeAccent(e)} cursorPosition={cursorPosition} isDisabled={isDisabled} />
      </Pane>
    </Pane>
  )
}

AssistedTextField.defaultProps = {
  placeholder: '',
  isFocus: false,
  isDisabled: false,
  validationMessage: null,
  ariaLabel: '',
  isRequired: true,
  isFullWidth: false
}

AssistedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isFocus: PropTypes.bool,
  isDisabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  isRequired: PropTypes.bool,
  isFullWidth: PropTypes.bool
}

export default AssistedTextField
