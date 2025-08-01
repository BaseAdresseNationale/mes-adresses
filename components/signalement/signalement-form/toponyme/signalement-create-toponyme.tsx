import React, { useContext } from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { BasesLocalesService, Position } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import LayoutContext from "@/contexts/layout";
import BalDataContext from "@/contexts/bal-data";
import { useSignalementMapDiffCreation } from "../../hooks/useSignalementMapDiffCreation";

interface SignalementCreateToponymeProps {
  signalement: Signalement;
  author?: Signalement["author"];
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementCreateToponyme({
  signalement,
  author,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementCreateToponymeProps) {
  const { nom, parcelles, positions } =
    signalement.changesRequested as ToponymeChangesRequestedDTO;
  const { pushToast } = useContext(LayoutContext);
  const { baseLocale, reloadToponymes } = useContext(BalDataContext);

  useSignalementMapDiffCreation(
    signalement.changesRequested as ToponymeChangesRequestedDTO
  );

  const onAccept = async () => {
    try {
      await BasesLocalesService.createToponyme(baseLocale.id, {
        nom,
        parcelles,
        positions: positions as any[],
      });
      await reloadToponymes();
      await handleAccept();
    } catch (error) {
      console.error("Error accepting signalement:", error);
      pushToast({
        title: "Erreur lors de l'acceptation du signalement.",
        intent: "danger",
      });
    }
  };

  return (
    <>
      <SignalementToponymeDiffCard
        title="Demande de création d'un toponyme"
        signalementType={Signalement.type.LOCATION_TO_CREATE}
        isActive
        nom={{
          to: nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
      />
      <SignalementFormButtons
        author={author}
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementCreateToponyme;
