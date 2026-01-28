import { Pane, Dialog } from "evergreen-ui";

interface DeleteWarningProps {
  isShown: boolean;
  content: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isDisabled?: boolean;
}

function DeleteWarning({
  isShown,
  content,
  onCancel,
  onConfirm,
  isDisabled,
}: DeleteWarningProps) {
  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Attention"
        intent="danger"
        cancelLabel="Annuler"
        confirmLabel="Supprimer"
        onCloseComplete={onCancel}
        onCancel={onCancel}
        onConfirm={onConfirm}
        isConfirmLoading={isDisabled}
        isConfirmDisabled={isDisabled}
      >
        {content}
      </Dialog>
    </Pane>
  );
}

export default DeleteWarning;
