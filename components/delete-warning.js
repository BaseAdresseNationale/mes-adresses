import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Dialog} from 'evergreen-ui'

function DeleteWarning({isShown, content, onCancel, onConfirm}) {
  return (
    <>
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
        >
          {content}
        </Dialog>
      </Pane>
    </>
  )
}

DeleteWarning.propTypes = {
  isShown: PropTypes.bool,
  content: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

DeleteWarning.defaultProps = {
  isShown: false,
}

export default DeleteWarning
