import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import {FormField} from 'evergreen-ui'
import {splitBoxProps} from 'ui-box' // eslint-disable-line import/no-extraneous-dependencies

import CommuneSearch from './commune-search'

let idCounter = 0

export function CommuneSearchField({
  // We are using the id from the state
  id: unusedId,

  // FormField props
  hint,
  label,
  description,
  validationMessage,

  // TextInput props
  inputHeight,
  inputWidth,
  disabled,
  required,
  isInvalid,
  appearance,
  placeholder,
  spellCheck,

  // Rest props are spread on the FormField
  ...props
}) {
  const id = useMemo(() => `CommuneSearchField-${unusedId || idCounter++}`, [unusedId])
  const {matchedProps, remainingProps} = splitBoxProps(props)

  return (
    <FormField
      marginBottom={24}
      label={label}
      isRequired={required}
      hint={hint}
      description={description}
      validationMessage={validationMessage}
      labelFor={id}
      autocomplete='off'
      {...matchedProps}
    >
      <CommuneSearch
        id={id}
        width={inputWidth}
        height={inputHeight}
        disabled={disabled}
        required={required}
        isInvalid={isInvalid}
        appearance={appearance}
        placeholder={placeholder}
        spellCheck={spellCheck}
        {...remainingProps}
      />
    </FormField>
  )
}

CommuneSearchField.propTypes = {
  ...CommuneSearch.propTypes,

  label: PropTypes.node.isRequired,
  description: PropTypes.node,
  hint: PropTypes.node,
  validationMessage: PropTypes.node,
  inputHeight: PropTypes.number,
  inputWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isInvalid: PropTypes.bool,
  appearance: PropTypes.string,
  placeholder: PropTypes.string,
  spellCheck: PropTypes.bool
}

CommuneSearchField.defaultProps = {
  description: null,
  hint: null,
  validationMessage: null,
  disabled: false,
  required: false,
  isInvalid: false,
  appearance: null,
  placeholder: null,
  spellCheck: true,
  inputWidth: '100%',
  inputHeight: 32
}

export default CommuneSearchField
