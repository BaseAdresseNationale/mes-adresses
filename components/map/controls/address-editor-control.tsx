import { IconButton, AddIcon, CrossIcon } from "evergreen-ui";

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
    <>
      {isAddressFormOpen ? (
        <IconButton
          height={29}
          width={29}
          icon={CrossIcon}
          onClick={() => handleAddressForm(false)}
          title="Annuler la création d'une adresse"
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
          title="Créer une adresse"
        />
      )}
    </>
  );
}

export default AddressEditorControl;
