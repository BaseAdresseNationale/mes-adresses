import ResponsiveImage from "@/components/respponsive-image";
import { Pane } from "evergreen-ui";

interface PopupFeaturePanoramaxProps {
  feature: {
    properties: {
      id: string;
    };
  };
}

function PopupFeaturePanoramax({ feature }: PopupFeaturePanoramaxProps) {
  return (
    <Pane>
      <ResponsiveImage
        alt="Panoramax picture thumbnail"
        src={`${process.env.NEXT_PUBLIC_PANORAMAX_API_ENDPOINT}/api/pictures/${feature.properties.id}/thumb.jpg`}
      />
    </Pane>
  );
}

export default PopupFeaturePanoramax;
