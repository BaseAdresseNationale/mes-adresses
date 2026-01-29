import { Alert, Dialog, Pane } from "evergreen-ui";
import { BaseLocale } from "@/lib/openapi-api-bal";
import FondDeCarteForm from "./fond-de-carte-form";

interface FondDeCarteDialogProps {
  isShown: boolean;
  onCloseComplete: () => void;
}

export function FondDeCarteDialog({
  isShown,
  onCloseComplete,
}: FondDeCarteDialogProps) {
  return (
    <Dialog
      isShown={isShown}
      title="Ajouter fond de carte"
      hasFooter={false}
      onCloseComplete={onCloseComplete}
    >
      <Pane paddingBottom={16}>
        <Alert
          marginBottom={8}
          intent="none"
          title="Comment rajouter ses propres fonds de carte ?"
        >
          Seul les urls des flux WMTS ou WMS sont supportées. Les données
          doivent être de type raster et les images de 256x256 pixels. Voir
          l&apos;exemple ci-dessous.
        </Alert>
        <FondDeCarteForm />
      </Pane>
    </Dialog>
  );
}

export default FondDeCarteDialog;
