import {useEffect, useContext, useRef} from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import useKeyEvent from '@/hooks/key-event'

function Form({editingId, unmountForm, closeForm, onFormSubmit, children}) {
  const {isEditing, setEditingId, setIsEditing} = useContext(BalDataContext)

  const formRef = useRef(false)

  useKeyEvent(({key}) => {
    if (key === 'Escape') {
      closeForm()
    }
  }, [closeForm], 'keyup')

  // Close form when edition is canceled form menu
  useEffect(() => {
    if (formRef.current && !isEditing) {
      closeForm()
    }
  }, [isEditing, closeForm])

  useEffect(() => {
    setIsEditing(true)
    formRef.current = true
    if (editingId) {
      setEditingId(editingId)
    }

    return () => {
      setIsEditing(false)
      setEditingId(null)

      if (unmountForm) {
        unmountForm()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Pane
      is='form'
      display='flex'
      flexDirection='column'
      background='gray300'
      padding={12}
      height='100%'
      maxHeight='100%'
      width='100%'
      position='absolute'
      overflowY='scroll'
      zIndex={1}
      onSubmit={onFormSubmit}
    >
      {children}
    </Pane>
  )
}

Form.defaultProps = {
  editingId: null,
  unmountForm: null
}

Form.propTypes = {
  editingId: PropTypes.string,
  unmountForm: PropTypes.func,
  closeForm: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default Form

