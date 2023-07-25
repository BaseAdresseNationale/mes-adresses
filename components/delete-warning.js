import PropTypes from 'prop-types'
import {Pane, Dialog} from 'evergreen-ui'

function DeleteWarning({isShown, content, onCancel, onConfirm, isDisabled}) {
  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title='Attention'
        intent='danger'
        cancelLabel='Annuler'
        confirmLabel='Supprimer'
        onCloseComplete={onCancel}
        onCancel={onCancel}
        onConfirm={onConfirm}
        isConfirmLoading={isDisabled}
        isConfirmDisabled={isDisabled}
      >
        {content}
      </Dialog>
    </Pane>
  )
}

DeleteWarning.propTypes = {
  isShown: PropTypes.bool,
  content: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

DeleteWarning.defaultProps = {
  isShown: false,
  isDisabled: false
}

export default DeleteWarning
