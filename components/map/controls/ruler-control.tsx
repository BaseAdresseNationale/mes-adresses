import DrawContext, { DrawMode } from "@/contexts/draw";
import { CrossIcon, IconButton } from "evergreen-ui";
import Image from "next/image";
import { useContext } from "react";

interface RulerControlProps {
  disabled?: boolean;
}

function RulerControl({ disabled }: RulerControlProps) {
  const { drawMode, setDrawMode } = useContext(DrawContext);

  return drawMode === DrawMode.RULER ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={() => setDrawMode(null)}
      title="Fermer l’outil de mesure"
    />
  ) : (
    <IconButton
      disabled={disabled}
      onClick={() => setDrawMode(DrawMode.RULER)}
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
