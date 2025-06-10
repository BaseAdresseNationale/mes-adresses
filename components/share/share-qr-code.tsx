import { Pane } from "evergreen-ui";
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
      <QRCodeSVG
        value={url}
        size={256}
        imageSettings={{
          src: "/static/images/bal-logo.png",
          height: 40,
          width: 40,
          excavate: true,
        }}
      />
    </Pane>
  );
}

export default ShareQRCode;
