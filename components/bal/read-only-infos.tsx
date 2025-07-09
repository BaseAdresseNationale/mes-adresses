import React from "react";
import { Pane, Alert, Text, Button } from "evergreen-ui";

interface BALReadOnlyProps {
  openRecoveryDialog: () => void;
}

function BALReadOnly({ openRecoveryDialog }: BALReadOnlyProps) {
  return (
    <Pane backgroundColor="white" padding={8}>
      <Alert
        intent="warning"
        title="Vous êtes en mode consultation"
        marginBottom={15}
      >
        <Text is="p">
          Vous ne pouvez pas modifier cette Base Adresse Locale car vous n’êtes
          pas authentifié comme administrateur.
        </Text>
        <Text is="p">
          Si vous êtes administrateur de cette Base Adresse Locale, vous pouvez
          récupérer vos accès en cliquant sur le bouton ci-dessous.
        </Text>
        <Button appearance="primary" onClick={openRecoveryDialog}>
          Récupérer mes accès
        </Button>
      </Alert>
    </Pane>
  );
}

export default BALReadOnly;
