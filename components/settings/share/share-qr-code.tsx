import { Pane, Text } from "evergreen-ui";
import { QRCodeSVG } from "qrcode.react";

interface ShareQRCodeProps {
  url: string;
}

function ShareQRCode({ url }: ShareQRCodeProps) {
  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop={12}
    >
      <Text
        is="label"
        htmlFor="bal-access-qr-code"
        marginBottom={8}
        alignSelf="flex-start"
        fontWeight="500"
        color="dark"
      >
        QR code de connexion administrateur
      </Text>
      <QRCodeSVG
        id="bal-access-qr-code"
        value={url}
        size={256}
        imageSettings={{
          src: "/static/images/cadenas.svg",
          height: 40,
          width: 40,
          excavate: true,
        }}
      />
    </Pane>
  );
}

export default ShareQRCode;
