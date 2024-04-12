import {
  Tooltip,
  Position,
  IconButton,
  AddIcon,
  CrossIcon,
} from "evergreen-ui";

interface AddressEditorControlProps {
  isAddressFormOpen?: boolean;
  isDisabled?: boolean;
  handleAddressForm: (isAddressFormOpen: boolean) => void;
}

function AddressEditorControl({
  isAddressFormOpen,
  isDisabled,
  handleAddressForm,
}: AddressEditorControlProps) {
  return (
    <Tooltip
      position={Position.LEFT}
      content={isAddressFormOpen ? "Annuler" : "Créer une adresse"}
    >
      {isAddressFormOpen ? (
        <IconButton
          height={29}
          width={29}
          icon={CrossIcon}
          onClick={() => handleAddressForm(false)}
        />
      ) : (
        <IconButton
          height={29}
          width={29}
          icon={AddIcon}
          disabled={isDisabled}
          intent="success"
          appearance="primary"
          onClick={() => handleAddressForm(true)}
        />
      )}
    </Tooltip>
  );
}

export default AddressEditorControl;
