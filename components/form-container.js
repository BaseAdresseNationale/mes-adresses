import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function FormContainer({children, ...props}) {
  return (
    <Pane is='form' background='gray300' flex={1} padding={12} height='auto' {...props}>
      {children}
    </Pane>
  )
}

FormContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default FormContainer
