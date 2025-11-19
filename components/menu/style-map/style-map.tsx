import { Pane, Heading, MapIcon, Button, Paragraph } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import { useContext } from "react";
import StyleMapForm from "./style-map-form";

interface StyleMapProps {}

function StyleMap({}: StyleMapProps) {
  return (
    <Pane
      height="100%"
      display="flex"
      flexDirection="column"
      backgroundColor="#FAFBFF"
    >
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
          <MapIcon />
          <Heading paddingLeft={5}>Fond de carte</Heading>
        </Pane>
      </Pane>
      <Pane padding={16}>
        <StyleMapForm />
      </Pane>
    </Pane>
  );
}

export default StyleMap;
