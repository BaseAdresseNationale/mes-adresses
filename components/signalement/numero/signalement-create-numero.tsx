import { Button, Pane } from "evergreen-ui";
import React from "react";
import NumeroEditor from "../../bal/numero-editor";
import { CommuneType } from "@/types/commune";
import { Numero } from "@/lib/openapi-api-bal";
import { Signalement } from "@/lib/openapi-signalement";

interface SignalementCreateNumeroProps {
  signalement: Signalement;
  initialVoieId: string;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  commune: CommuneType;
}

function SignalementCreateNumero({
  signalement,
  initialVoieId,
  handleSubmit,
  handleClose,
  commune,
}: SignalementCreateNumeroProps) {
  return (
    <Pane position="relative" height="100%">
      <NumeroEditor
        hasPreview
        initialValue={signalement.changesRequested as unknown as Numero}
        initialVoieId={initialVoieId}
        commune={commune}
        closeForm={handleClose}
        onSubmitted={handleSubmit}
        certificationBtnProps={{
          children: (
            <Button type="button" intent="danger" onClick={handleSubmit}>
              Ignorer
            </Button>
          ),
        }}
      />
    </Pane>
  );
}

export default SignalementCreateNumero;
