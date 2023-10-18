import {Pane} from 'evergreen-ui'
import React from 'react'

interface FormInputProps {
  children: React.ReactNode;
}

function FormInput({children}: FormInputProps) {
  return (
    <Pane background='white' padding={8} borderRadius={8} marginBottom={8} width='100%'>
      {children}
    </Pane>
  )
}

export default FormInput
