import { Pane, Paragraph } from "evergreen-ui";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { CommuneType } from "@/types/commune";
import SignalementCard from "../signalement-card";
import VoieEditor from "@/components/bal/voie-editor";
import { Signalement } from "@/lib/openapi-signalement";
import { Voie } from "@/lib/openapi";

interface SignalementUpdateVoieProps {
  signalement: Signalement;
  existingLocation: Voie;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  commune: CommuneType;
}

function SignalementUpdateVoie({
  signalement,
  existingLocation,
  handleSubmit,
  handleClose,
}: SignalementUpdateVoieProps) {
  const { nom } = signalement.changesRequested;
  const formInputRef = useRef<HTMLDivElement>(null);

  const [changes, setChanges] = useState({
    nom: nom !== existingLocation.nom,
  });
  const [refsInitialized, setRefsInitialized] = useState(false);
  const [editorValue, setEditorValue] = useState(existingLocation);

  useEffect(() => {
    if (formInputRef.current) {
      changes.nom
        ? (formInputRef.current.style.border = "solid #f3b346 2px")
        : (formInputRef.current.style.border = "none");
      setRefsInitialized(true);
    }
  }, [formInputRef, changes]);

  const handleAcceptChange = (key: string, value: any) => {
    setEditorValue({ ...editorValue, [key]: value });
    setChanges({ ...changes, [key]: false });
  };

  const handleRefuseChange = (key: string) => {
    setChanges({ ...changes, [key]: false });
  };

  return (
    <Pane position="relative" height="100%">
      <VoieEditor
        initialValue={editorValue}
        closeForm={handleClose}
        formInputRef={formInputRef}
        onSubmitted={handleSubmit}
      />
      {refsInitialized &&
        changes.nom &&
        ReactDOM.createPortal(
          <SignalementCard
            onAccept={() => handleAcceptChange("nom", nom)}
            onRefuse={() => handleRefuseChange("nom")}
          >
            <Paragraph>{nom}</Paragraph>
          </SignalementCard>,
          formInputRef.current
        )}
    </Pane>
  );
}

export default SignalementUpdateVoie;
