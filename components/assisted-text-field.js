import PropTypes from 'prop-types'
import {Pane, TextInputField} from 'evergreen-ui'

import useCaretPosition from '@/hooks/caret-position'
import AccentTool from '@/components/accent-tool'

function AssistedTextField({label, placeholder, value, isFocus, validationMessage, onChange, isDisabled, isRequired, exitFocus}) {
  const {ref: inputRef, updateCaretPosition} = useCaretPosition({initialValue: value, isFocus})
  const handleChangeAccent = e => {
    onChange(e)
    updateCaretPosition()
  }

  return (
    <Pane display='flex' alignItems={validationMessage ? 'last baseline' : 'flex-end'}>
      <TextInputField
        ref={inputRef}
        required={isRequired}
        marginBottom={0}
        disabled={isDisabled}
        label={label}
        placeholder={placeholder}
        value={value}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
        onChange={onChange}
        onBlur={exitFocus}
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
          handleAccent={handleChangeAccent}
          updateCaret={updateCaretPosition}
          isDisabled={isDisabled}
          forwadedRef={inputRef}
        />
      </Pane>
    </Pane>
  )
}

AssistedTextField.defaultProps = {
  placeholder: '',
  isDisabled: false,
  validationMessage: null,
  isRequired: true,
  isFocus: false,
  exitFocus: () => {}
}

AssistedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isFocus: PropTypes.bool,
  exitFocus: PropTypes.func
}

export default AssistedTextField
