import { Pane, Heading, CogIcon } from "evergreen-ui";

import BALSettingsForm from "./bal-settings-form";
import { BaseLocale } from "@/lib/openapi-api-bal";

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
