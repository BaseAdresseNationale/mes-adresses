import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function FormInput({children}) {
  return (
    <Pane background='white' padding={8} borderRadius={8} marginBottom={8} width='100%'>
      {children}
    </Pane>
  )
}

FormInput.propTypes = {
  children: PropTypes.node.isRequired
}
export default FormInput
