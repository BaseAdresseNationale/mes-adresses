import React, { useContext } from "react";
import {
  BasesLocalesService,
  Toponyme,
  Voie,
  VoiesService,
} from "@/lib/openapi-api-bal";
import {
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { useSignalementMapDiffCreation } from "@/components/signalement/hooks/useSignalementMapDiffCreation";
import LayoutContext from "@/contexts/layout";
import BalDataContext from "@/contexts/bal-data";
import { Alert, Text } from "evergreen-ui";

interface SignalementCreateNumeroProps {
  signalement: Signalement;
  author?: Signalement["author"];
  voie?: Voie;
  requestedToponyme?: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementCreateNumero({
  signalement,
  author,
  voie,
  requestedToponyme,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementCreateNumeroProps) {
  const { numero, suffixe, parcelles, positions, nomVoie } =
    signalement.changesRequested as NumeroChangesRequestedDTO;
  const { pushToast } = useContext(LayoutContext);
  const { baseLocale, reloadVoies } = useContext(BalDataContext);

  useSignalementMapDiffCreation(
    signalement.changesRequested as NumeroChangesRequestedDTO
  );

  const onAccept = async () => {
    try {
      let newVoie;
      if (!voie) {
        newVoie = await BasesLocalesService.createVoie(baseLocale.id, {
          nom: nomVoie,
        });
        await reloadVoies();
      }
      const voieId = voie?.id || newVoie.id;
      await VoiesService.createNumero(voieId, {
        numero,
        suffixe,
        positions: positions as any[],
        parcelles,
        certifie: true,
        toponymeId: requestedToponyme?.id,
      });
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
      <SignalementNumeroDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_CREATE}
        title="Demande de création d'adresse"
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: nomVoie,
        }}
        complement={{
          to: requestedToponyme?.nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
      />

      {!voie && (
        <Alert flexShrink={0}>
          <Text>
            La nouvelle voie <b>{nomVoie}</b> sera créée en acceptant ce
            signalement
          </Text>
        </Alert>
      )}

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

export default SignalementCreateNumero;
