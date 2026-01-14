import { Spinner, Pane, Paragraph } from "evergreen-ui";

interface OverlayProps {
  text?: string;
}

function Overlay({ text }: OverlayProps) {
  return (
    <div>
      <div className="overlay">
        <Pane
          display="flex"
          flexGrow="1"
          flexFlow="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Spinner size={64} />
          <Paragraph marginTop="default" color="white">
            {text}
          </Paragraph>
        </Pane>
        <style jsx>{`
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 4;
            background-color: rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Overlay;
