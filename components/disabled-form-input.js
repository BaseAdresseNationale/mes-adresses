import PropTypes from 'prop-types'
import {Pane, Alert, Label} from 'evergreen-ui'

function DisabledFormInput({label}) {
  return (
    <Pane
      background='white'
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width='100%'
    >
      <Label>{label}</Label>
      <Alert
        marginY={4}
        intent='warning'
        title='Cette fonctionnalité n’est pas disponible pour cette commune.'
      />
    </Pane>
  )
}

DisabledFormInput.propTypes = {
  label: PropTypes.string.isRequired
}

export default DisabledFormInput
