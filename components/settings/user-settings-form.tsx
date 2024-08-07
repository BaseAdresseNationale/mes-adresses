import { useContext, useState } from "react";
import LocalStorageContext from "@/contexts/local-storage";
import { Button, Checkbox, Pane } from "evergreen-ui";

import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import LayoutContext from "@/contexts/layout";

function UserSettingsForm() {
  const { userSettings, setUserSettings } = useContext(LocalStorageContext);
  const [userSettingsForm, setUserSettingsForm] = useState(userSettings);
  const { pushToast } = useContext(LayoutContext);

  const hasChanged = () =>
    JSON.stringify(userSettingsForm) !== JSON.stringify(userSettings);

  const onSubmit = (e) => {
    e.preventDefault();
    setUserSettings(userSettingsForm);
    pushToast({
      title: "Les préférences utilisateurs ont été enregistrées avec succès",
      intent: "success",
    });
  };

  return (
    <FormContainer onSubmit={onSubmit} display="flex" flexDirection="column">
      <Pane>
        <FormInput>
          <Checkbox
            name="colorblind-mode"
            id="colorblind-mode"
            label="Activer le mode daltonien"
            checked={userSettingsForm?.colorblindMode}
            onChange={() =>
              setUserSettingsForm((settings) => ({
                ...settings,
                colorblindMode: !settings?.colorblindMode,
              }))
            }
          />
        </FormInput>
      </Pane>

      <Button
        height={40}
        marginTop={8}
        type="submit"
        appearance="primary"
        disabled={!hasChanged()}
        width="fit-content"
      >
        Enregistrer les changements
      </Button>
    </FormContainer>
  );
}

export default UserSettingsForm;
