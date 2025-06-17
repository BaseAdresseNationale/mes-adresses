import { useState } from "react";
import { Pane, Heading, Tablist, Tab, CogIcon } from "evergreen-ui";

import UserSettingsForm from "./user-settings-form";
import BALSettingsForm from "./bal-settings-form";
import { BaseLocale } from "@/lib/openapi-api-bal";

const getSettingsTabs = (hideBalSettings) => {
  const tabs = [
    {
      key: "bal-settings",
      label: "Paramètres de la Base Adresse Locale",
    },
    {
      key: "user-preferences",
      label: "Préférences utilisateurs",
    },
  ];
  // Only show user preferences if the user is not an admin
  if (hideBalSettings) {
    tabs.shift();
  }

  return tabs;
};

interface SettingsProps {
  baseLocale: BaseLocale;
}

function Settings({ baseLocale }: SettingsProps) {
  return (
    <Pane height="100%" display="flex" flexDirection="column">
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <CogIcon />
          <Heading paddingLeft={5}>Paramètres</Heading>
        </Pane>
      </Pane>

      <BALSettingsForm baseLocale={baseLocale} />
    </Pane>
  );
}

export default Settings;
