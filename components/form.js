import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function Form({children, onFormSubmit}) {
  return (
    <Pane is='form' background='gray300' flex={1} padding={12} height='100%' onSubmit={onFormSubmit}>
      {children}
    </Pane>
  )
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onFormSubmit: PropTypes.func
}

export default Form
