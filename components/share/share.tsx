import { Pane, Heading, ShareIcon, Label } from "evergreen-ui";
import { useMemo } from "react";
import ShareClipBoard from "./share-clipboard";
import ShareQRCode from "./share-qr-code";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

interface ShareProps {
  baseLocaleId: string;
  token?: string;
}

function Share({ baseLocaleId, token }: ShareProps) {
  const urlAdminBal = useMemo(() => {
    const url = `https://mes-adresses.data.gouv.fr/bal/${baseLocaleId}`;
    return token ? `${url}/${token}` : url;
  }, [baseLocaleId, token]);

  return (
    <Pane>
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
        <ShareClipBoard
          title="Lien administrateur de la BAL"
          url={urlAdminBal}
        />
        <ShareQRCode
          title="QR code administrateur de la BAL"
          url={urlAdminBal}
        />
      </Pane>
    </Pane>
  );
}

export default Share;
