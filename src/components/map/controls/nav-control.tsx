import {
  NavigationControl,
  NavigationControlProps,
} from "react-map-gl/maplibre";
import { Pane } from "evergreen-ui";

function NavControl(props: NavigationControlProps) {
  return (
    <Pane position="absolute" top={16} right={46} zIndex={2}>
      <NavigationControl showCompass={false} {...props} />
    </Pane>
  );
}

export default NavControl;
