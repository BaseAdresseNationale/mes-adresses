import { BaseLocale } from "@/lib/openapi-api-bal";
import React from "react";
import { TextInputField, Pane } from "evergreen-ui";

interface FondDeCarteListProps {
  baseLocale: BaseLocale;
}

function FondDeCarteList({ baseLocale }: FondDeCarteListProps) {
  return (
    <Pane flex={1}>
      {baseLocale.settings?.fondsDeCartes?.map((fondDeCarte) => (
        <Pane key={fondDeCarte.name} display="flex" gap={4} maxWidth={400}>
          <TextInputField
            readOnly
            disabled
            value={fondDeCarte.name}
            width="30%"
            marginBottom={0}
          />
          <TextInputField
            readOnly
            disabled
            value={fondDeCarte.url}
            width="70%"
            marginBottom={0}
          />
        </Pane>
      ))}
    </Pane>
  );
}

export default FondDeCarteList;
