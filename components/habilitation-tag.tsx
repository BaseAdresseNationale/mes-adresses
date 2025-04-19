import React from "react";
import NextImage from "next/legacy/image";
import { Pane, Tooltip } from "evergreen-ui";

interface HabilitationTagProps {
  communeName: string;
  isHabilitationValid: boolean;
}

function HabilitationTag({
  communeName,
  isHabilitationValid,
}: HabilitationTagProps) {
  const tooltipContent = isHabilitationValid
    ? `Base Adresse Locale administrée par la commune de ${communeName}`
    : "La Base Adresse Locale n'est pas habilitée";

  return (
    <Tooltip content={tooltipContent}>
      <Pane
        position="relative"
        width={24}
        height={24}
        {...(isHabilitationValid && { cursor: "pointer" })}
      >
        <NextImage
          src={
            isHabilitationValid
              ? "/static/images/bal-logo.png"
              : "/static/images/bal-logo-disabled.png"
          }
          alt="Logo Base Adresse Locale"
          layout="fill"
        />
      </Pane>
    </Tooltip>
  );
}

export default React.memo(HabilitationTag);
