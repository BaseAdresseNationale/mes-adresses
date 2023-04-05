import PropTypes from 'prop-types'
import {Dialog} from 'evergreen-ui'

function ConvertVoieWarning({isShown, content, isLoading, onCancel, onConfirm}) {
  return (
    <Dialog
      isShown={isShown}
      title='Attention'
      cancelLabel='Annuler'
      confirmLabel='Convertir'
      onCloseComplete={onCancel}
      onCancel={onCancel}
      onConfirm={onConfirm}
      hasCancel={!isLoading}
      hasClose={!isLoading}
      isConfirmLoading={isLoading}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEscapePress={!isLoading}
    >
      {content}
    </Dialog>
  )
}

ConvertVoieWarning.propTypes = {
  isShown: PropTypes.bool,
  content: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

ConvertVoieWarning.defaultProps = {
  isShown: false
}

export default ConvertVoieWarning
