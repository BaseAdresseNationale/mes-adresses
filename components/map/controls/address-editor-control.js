import PropTypes from 'prop-types'
import {Tooltip, Position, IconButton, AddIcon, CrossIcon} from 'evergreen-ui'

function AddressEditorControl({isAddressFormOpen, isDisabled, handleAddressForm}) {
  return (
    <Tooltip position={Position.LEFT} content={isAddressFormOpen ? 'Annuler' : 'Créer une adresse'}>
      {isAddressFormOpen ? (
        <IconButton height={29} width={29} icon={CrossIcon} onClick={() => handleAddressForm(false)} />
      ) : (
        <IconButton
          height={29} width={29}
          icon={AddIcon}
          disabled={isDisabled}
          intent='success'
          appearance='primary'
          onClick={() => handleAddressForm(true)}
        />
      )}
    </Tooltip>
  )
}

AddressEditorControl.propTypes = {
  isAddressFormOpen: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  handleAddressForm: PropTypes.func.isRequired
}

export default AddressEditorControl
