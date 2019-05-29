import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Dialog} from 'evergreen-ui'

function DeleteWarning({content, onCancel, onConfirm}) {
  return (
    <>
      <Pane>
        <Dialog
          isShown={content}
          title='Attention'
          intent='danger'
          cancelLabelstring='Annuler'
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
  content: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

DeleteWarning.defaultProps = {
  content: null
}

export default DeleteWarning
