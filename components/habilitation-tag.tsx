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
  const tag = (
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
  );
  return isHabilitationValid ? (
    <Tooltip
      content={`Base Adresse Locale administrée par la commune de ${communeName}`}
    >
      {tag}
    </Tooltip>
  ) : (
    tag
  );
}

export default React.memo(HabilitationTag);
