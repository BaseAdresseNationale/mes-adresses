import { Dialog } from "evergreen-ui";

interface DialogWarningActionProps {
  confirmLabel: string;
  isShown: boolean;
  content: React.ReactNode;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DialogWarningAction({
  confirmLabel,
  isShown = false,
  content,
  isLoading,
  onCancel,
  onConfirm,
}: DialogWarningActionProps) {
  return (
    <Dialog
      isShown={isShown}
      title="Attention"
      cancelLabel="Annuler"
      confirmLabel={confirmLabel}
      onCloseComplete={onCancel}
      onCancel={onCancel}
      onConfirm={onConfirm}
      hasCancel={!isLoading}
      hasClose={!isLoading}
      isConfirmLoading={isLoading}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEscapePress={!isLoading}
    >
      {content}
    </Dialog>
  );
}

export default DialogWarningAction;
