import {useEffect, useContext, useRef} from 'react'
import PropTypes from 'prop-types'

import BalDataContext from '@/contexts/bal-data'

import useKeyEvent from '@/hooks/key-event'

function FormMaster({editingId, mountForm, unmountForm, closeForm, children}) {
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

    if (mountForm) {
      mountForm()
    }

    return () => {
      setIsEditing(false)
      setEditingId(null)

      if (unmountForm) {
        unmountForm()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return children
}

FormMaster.defaultProps = {
  editingId: null,
  mountForm: null,
  unmountForm: null
}

FormMaster.propTypes = {
  editingId: PropTypes.string,
  mountForm: PropTypes.func,
  unmountForm: PropTypes.func,
  closeForm: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default FormMaster

