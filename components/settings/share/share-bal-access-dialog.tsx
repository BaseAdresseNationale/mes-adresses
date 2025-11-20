import { Alert, Dialog, MobilePhoneIcon, Pane, Text } from "evergreen-ui";
import ShareClipBoard from "./share-clipboard";
import ShareQRCode from "./share-qr-code";
import { BaseLocale } from "@/lib/openapi-api-bal";

interface ShareEmailsDialogProps {
  baseLocale: BaseLocale;
  isShown: boolean;
  token: string;
}

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

export function ShareBALAccessDialog({
  baseLocale,
  isShown,
  token,
}: ShareEmailsDialogProps) {
  const urlAdminBal = `${EDITEUR_URL}/bal/${baseLocale.id}/${token}`;

  return (
    <Dialog
      isShown={isShown}
      title="Partagez l'accès avec d'autres appareils"
      hasFooter={false}
    >
      <Pane paddingBottom={16}>
        <ShareClipBoard url={urlAdminBal} />
        <br />
        <ShareQRCode url={urlAdminBal} />
        <Alert intent="success" marginTop={12} hasIcon={false}>
          <Pane display="flex" alignItems="center">
            <MobilePhoneIcon size={24} marginRight={8} />
            <Text>
              Mes Adresses fonctionne aussi sur votre mobile. Scannez le code QR
              pour accéder à votre BAL.
            </Text>
          </Pane>
        </Alert>
      </Pane>
    </Dialog>
  );
}
