import DrawContext from "@/contexts/draw";
import { CrossIcon, IconButton } from "evergreen-ui";
import Image from "next/image";
import { useContext } from "react";

interface RulerControlProps {
  disabled?: boolean;
}

function RulerControl({ disabled }: RulerControlProps) {
  const { toggleRuler, isRulerEnabled } = useContext(DrawContext);

  return isRulerEnabled ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={toggleRuler}
      title="Fermer l’outil de mesure"
    />
  ) : (
    <IconButton
      disabled={disabled}
      onClick={toggleRuler}
      height={29}
      width={29}
      icon={
        <Image
          src="/static/images/ruler.svg"
          alt="Ruler icon"
          width={20}
          height={20}
        />
      }
      title="Mesurer une distance"
    />
  );
}

export default RulerControl;
