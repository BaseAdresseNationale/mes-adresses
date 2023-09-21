import {Dialog} from 'evergreen-ui'

interface ConvertVoieWarningProps {
  isShown: boolean;
  content: React.ReactNode;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConvertVoieWarning({isShown = false, content, isLoading, onCancel, onConfirm}: ConvertVoieWarningProps) {
  return (
    <Dialog
      isShown={isShown}
      title='Attention'
      cancelLabel='Annuler'
      confirmLabel='Convertir'
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
  )
}

export default ConvertVoieWarning
