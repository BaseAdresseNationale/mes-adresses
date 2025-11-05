import DrawContext, { DrawMode } from "@/contexts/draw";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { CrossIcon, IconButton } from "evergreen-ui";
import Image from "next/image";
import { useContext } from "react";

interface RulerControlProps {
  disabled?: boolean;
}

function RulerControl({ disabled }: RulerControlProps) {
  const { drawMode, setDrawMode } = useContext(DrawContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  return drawMode === DrawMode.RULER ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={() => {
        setDrawMode(null);
        matomoTrackEvent(
          MatomoEventCategory.MAP,
          MatomoEventAction[MatomoEventCategory.MAP].DISABLE_RULER
        );
      }}
      title="Fermer l’outil de mesure"
    />
  ) : (
    <IconButton
      disabled={disabled}
      onClick={() => {
        setDrawMode(DrawMode.RULER);
        matomoTrackEvent(
          MatomoEventCategory.MAP,
          MatomoEventAction[MatomoEventCategory.MAP].ENABLE_RULER
        );
      }}
      height={29}
      width={29}
      icon={
        <Image
          src="/static/images/ruler.svg"
          alt="Ruler icon"
          width={20}
          height={20}
          style={{ opacity: disabled ? 0.4 : 1 }}
        />
      }
      title="Mesurer une distance"
    />
  );
}

export default RulerControl;
