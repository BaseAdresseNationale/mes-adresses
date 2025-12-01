import { BaseLocale } from "@/lib/openapi-api-bal";
import React, { useState } from "react";
import {
  TextInputField,
  Button,
  Alert,
  Pane,
  CogIcon,
  Heading,
  EyeOpenIcon,
  Label,
  MapCreateIcon,
} from "evergreen-ui";
import { BALAdminEmails } from "./bal-admin-emails";
import { useBALSettings } from "@/hooks/bal-settings";
import RenewTokenDialog from "../renew-token-dialog";
import { ShareBALAccessDialog } from "./share/share-bal-access-dialog";

interface FondDeCarteListProps {
  baseLocale: BaseLocale;
}

function FondDeCarteList({ baseLocale }: FondDeCarteListProps) {
  return (
    <Pane flex={1}>
      {baseLocale.settings.fondDeCarte.map((fondDeCarte) => (
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
