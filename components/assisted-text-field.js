import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInputField} from 'evergreen-ui'

import AccentTool from '@/components/accent-tool'

function AssistedTextField({label, placeholder, value, validationMessage, onChange, isFocus, isDisabled, isRequired}) {
  const [cursorPosition, setCursorPosition] = useState({start: 0, end: 0})
  const textFieldRef = useRef()

  useEffect(() => {
    if (isFocus) {
      textFieldRef.current.focus()
    }
  }, [isFocus])

  const handleChangeAccent = e => {
    if (isFocus) {
      textFieldRef.current.focus()
    }

    onChange(e)
  }

  return (
    <Pane display='flex' alignItems={validationMessage ? 'last baseline' : 'flex-end'}>
      <TextInputField
        ref={textFieldRef}
        required={isRequired}
        marginBottom={0}
        disabled={isDisabled}
        label={label}
        placeholder={placeholder}
        value={value}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
        onChange={e => onChange(e)}
        onBlur={e => setCursorPosition({start: e.target.selectionStart, end: e.target.selectionEnd})}
      />
      <Pane
        display='flex'
        flexDirection='column'
        justifyContent='center'
        marginLeft={8}
        marginTop={3}
      >
        <AccentTool
          input={value}
          handleAccent={e => handleChangeAccent(e)}
          cursorPosition={cursorPosition}
          isDisabled={isDisabled}
        />
      </Pane>
    </Pane>
  )
}

AssistedTextField.defaultProps = {
  placeholder: '',
  isFocus: false,
  isDisabled: false,
  validationMessage: null,
  isRequired: true
}

AssistedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isFocus: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool
}

export default AssistedTextField
