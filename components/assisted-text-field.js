import PropTypes from 'prop-types'
import {Pane, TextInputField} from 'evergreen-ui'

import useCaretPosition from '@/hooks/caret-position'
import AccentTool from '@/components/accent-tool'

function AssistedTextField({label, forwadedRef, placeholder, value, validationMessage, onChange, isDisabled, isRequired, exitFocus}) {
  const {updateCaretPosition} = useCaretPosition({initialValue: value, ref: forwadedRef})

  const handleChangeAccent = e => {
    onChange(e)
    updateCaretPosition()
  }

  return (
    <Pane display='flex' alignItems='flex-start'>
      <TextInputField
        ref={forwadedRef}
        required={isRequired}
        flex={1}
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
        marginTop={label.length > 0 ? 26 : 8}
      >
        <AccentTool
          input={value}
          handleAccent={handleChangeAccent}
          updateCaret={updateCaretPosition}
          isDisabled={isDisabled}
          forwadedRef={forwadedRef}
        />
      </Pane>
    </Pane>
  )
}

AssistedTextField.defaultProps = {
  placeholder: '',
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
  forwadedRef: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  exitFocus: PropTypes.func.isRequired
}

export default AssistedTextField
