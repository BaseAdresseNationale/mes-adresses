import { NavigationControl, NavigationControlProps } from "react-map-gl";
import { Pane } from "evergreen-ui";
import { Viewport } from "maplibre-gl";

type NavControlProps = {
  // onViewportChange: (viewport: Viewport) => void;
} & NavigationControlProps;

function NavControl(props: NavControlProps) {
  return (
    <Pane position="absolute" top={16} right={46} zIndex={2}>
      <NavigationControl
        showCompass={false}
        // onViewportChange={onViewportChange}
        {...props}
      />
    </Pane>
  );
}

export default NavControl;
