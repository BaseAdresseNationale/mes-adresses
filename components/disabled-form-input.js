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
      <Label>
        {label}
      </Label>
      <Alert
        intent='warning'
        title='Cette fonctionnalité n’est pas disponible pour cette commune.'
      />
    </Pane>
  )
}

export default DisabledFormInput
