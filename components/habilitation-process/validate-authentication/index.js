import PropTypes from 'prop-types'
import {Pane, Button, ChevronLeftIcon} from 'evergreen-ui'

import CodeValidation from './code-validation'

function ValidateAuthentication({emailCommune, validatePinCode, resendCode, onCancel}) {
  return (
    <Pane>
      <CodeValidation
        email={emailCommune}
        resendCode={resendCode}
        handleSubmit={validatePinCode}
      />

      <Button iconBefore={ChevronLeftIcon} onClick={onCancel}>Annuler</Button>
    </Pane>
  )
}

ValidateAuthentication.propTypes = {
  emailCommune: PropTypes.string,
  validatePinCode: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ValidateAuthentication
