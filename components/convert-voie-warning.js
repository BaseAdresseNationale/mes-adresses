import PropTypes from 'prop-types'
import {Dialog} from 'evergreen-ui'

function ConvertVoieWarning({isShown, content, onCancel, onConfirm}) {
  return (
    <Dialog
      isShown={isShown}
      title='Attention'
      cancelLabel='Annuler'
      confirmLabel='Convertir'
      onCloseComplete={onCancel}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      {content}
    </Dialog>
  )
}

ConvertVoieWarning.propTypes = {
  isShown: PropTypes.bool,
  content: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

ConvertVoieWarning.defaultProps = {
  isShown: false
}

export default ConvertVoieWarning
