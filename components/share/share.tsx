import {
  Pane,
  Heading,
  ShareIcon,
  Text,
  Alert,
  MobilePhoneIcon,
} from "evergreen-ui";
import { useMemo } from "react";
import ShareClipBoard from "./share-clipboard";
import ShareQRCode from "./share-qr-code";
import ShareEmails from "./share-emails";
import { BaseLocale } from "@/lib/openapi-api-bal";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

interface ShareProps {
  baseLocale: BaseLocale;
  token?: string;
}

function Share({ baseLocale, token }: ShareProps) {
  const urlAdminBal = useMemo(() => {
    const url = `https://mes-adresses.data.gouv.fr/bal/${baseLocale.id}`;
    return token ? `${url}/${token}` : url;
  }, [baseLocale.id, token]);

  return (
    <Pane background="#E6E8F0" height="100%">
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <ShareIcon />
          <Heading paddingLeft={5}>Partager BAL</Heading>
        </Pane>
      </Pane>
      <Pane margin={12}>
        <Pane
          background="white"
          padding={16}
          borderRadius={8}
          marginBottom={12}
        >
          <Heading is="h4" marginBottom={12}>
            Partagez l&apos;accès avec d&apos;autres utilisateurs
          </Heading>
          <ShareEmails baseLocale={baseLocale} />
        </Pane>
        <Pane background="white" padding={16} borderRadius={8}>
          <Heading is="h4" marginBottom={12}>
            Partagez l&apos;accès avec d&apos;autres appareils
          </Heading>
          <ShareClipBoard url={urlAdminBal} />
          <br />
          <ShareQRCode url={urlAdminBal} />
          <Alert intent="success" marginTop={12} hasIcon={false}>
            <Pane display="flex" alignItems="center">
              <MobilePhoneIcon size={24} marginRight={8} />
              <Text>
                Mes Adresses fonctionne aussi sur votre mobile. Scannez le code
                QR pour accéder à votre BAL.
              </Text>
            </Pane>
          </Alert>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default Share;
