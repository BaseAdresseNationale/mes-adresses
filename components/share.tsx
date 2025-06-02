import { Pane, Heading, ShareIcon } from "evergreen-ui";
import { useMemo } from "react";
import CopyClipBoard from "./copy-clipboard";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

interface ShareProps {
  baseLocaleId: string;
  token?: string;
}

function Share({ baseLocaleId, token }: ShareProps) {
  const urlBal = useMemo(() => {
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
          <Heading paddingLeft={5}>Partage</Heading>
        </Pane>
      </Pane>
      <Pane margin={12}>
        <CopyClipBoard url={urlBal} />
      </Pane>
    </Pane>
  );
}

export default Share;
