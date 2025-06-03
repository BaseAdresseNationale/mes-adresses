import { Pane, Label } from "evergreen-ui";
import { QRCodeSVG } from "qrcode.react";

interface ShareQRCodeProps {
  title: string;
  url: string;
}

function ShareQRCode({ title, url }: ShareQRCodeProps) {
  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="left"
      marginTop={12}
    >
      <Label marginBottom={8}>{title}</Label>
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
