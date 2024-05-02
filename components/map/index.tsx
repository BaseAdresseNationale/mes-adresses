import dynamic from "next/dynamic";
import { Pane } from "evergreen-ui";

import MapLoader from "@/components/map/loader";
import { MapProps } from "./map";

const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <MapLoader />,
});

type MapWrapperProps = {
  left?: number;
  top?: number;
  bottom?: number;
} & MapProps;

function MapWrapper({
  left = 0,
  top = 0,
  bottom = 0,
  ...props
}: MapWrapperProps) {
  return (
    <Pane
      position="fixed"
      display="flex"
      transition="left 0.3s"
      top={top}
      right={0}
      bottom={bottom}
      left={left}
      zIndex={1}
    >
      <Map {...props} />
    </Pane>
  );
}

export default MapWrapper;
