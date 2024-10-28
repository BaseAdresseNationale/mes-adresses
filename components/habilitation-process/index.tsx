import { useState, useCallback, useContext, useEffect } from "react";
import Router from "next/router";
import { Dialog, Pane, Text, Spinner } from "evergreen-ui";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

import { ApiDepotService } from "@/lib/api-depot";

import BalDataContext from "@/contexts/bal-data";

import ValidateAuthentication from "@/components/habilitation-process/validate-authentication";
import StrategySelection from "@/components/habilitation-process/strategy-selection";
import AcceptedDialog from "@/components/habilitation-process/accepted-dialog";
import RejectedDialog from "@/components/habilitation-process/rejected-dialog";
import {
  BaseLocale,
  BasesLocalesService,
  HabilitationService,
  StrategyDTO,
} from "@/lib/openapi";
import { CommuneType } from "@/types/commune";
import LayoutContext from "@/contexts/layout";

function getStep(habilitation) {
  if (habilitation.status !== "pending") {
    return 2;
  }

  if (habilitation.strategy?.type === "email") {
    return 1;
  }

  return 0;
}

interface HabilitationProcessProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
  habilitation: any;
  handlePublication: () => void;
  resetHabilitationProcess: () => void;
  handleClose: () => void;
}

function HabilitationProcess({
  baseLocale,
  commune,
  habilitation,
  handlePublication,
  resetHabilitationProcess,
  handleClose,
}: HabilitationProcessProps) {
  const [step, setStep] = useState(getStep(habilitation));
  const [isLoading, setIsLoading] = useState(false);
  const [isConflicted, setIsConflicted] = useState(false);
  const [isLoadingPublish, setIsLoadingPublish] = useState(false);
  const { pushToast } = useContext(LayoutContext);

  const { reloadHabilitation, reloadBaseLocale } = useContext(BalDataContext);

  const sendCode = async () => {
    try {
      await HabilitationService.sendPinCodeHabilitation(baseLocale.id);

      return true;
    } catch (error) {
      pushToast({
        intent: "danger",
        title: "Le courriel n’a pas pu être envoyé",
        message: error.body?.message,
      });
    }
  };

  const redirectToFranceConnect = () => {
    const redirectUrl = encodeURIComponent(
      `${EDITEUR_URL}${Router.asPath}?france-connect=1`
    );
    Router.push(
      `${habilitation.franceconnectAuthenticationUrl}?redirectUrl=${redirectUrl}`
    );
  };

  const handleStrategy = async (selectedStrategy) => {
    setIsLoading(true);
    if (selectedStrategy === StrategyDTO.type.EMAIL) {
      const codeSent = await sendCode();
      if (codeSent) {
        setStep(1);
      }
    }

    if (
      selectedStrategy === StrategyDTO.type.FRANCECONNECT &&
      habilitation.franceconnectAuthenticationUrl
    ) {
      redirectToFranceConnect();
    }

    setIsLoading(false);
  };

  // Checks revisions to warn of a conflict
  const checkConflictingRevision = useCallback(async () => {
    try {
      const revisions = await ApiDepotService.getRevisions(commune.code);
      setIsConflicted(revisions.length > 0);
    } catch (error) {
      console.error(
        "ERROR: Impossible de récupérer les révisions pour cette commune",
        error.body
      );
    }
  }, [commune.code]);

  const handleValidationCode = async (code: string) => {
    setIsLoading(true);
    try {
      await HabilitationService.validePinCodeHabilitation(baseLocale.id, {
        code,
      });

      checkConflictingRevision();
      // SET RESUME BAL IF HABILITATION CODE
      if (baseLocale.sync?.isPaused == true) {
        await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      }
      setStep(2);
    } catch (error) {
      pushToast({
        intent: "danger",
        title: "Le code n’est pas valide",
        message: error.body.message,
      });
    }

    await reloadHabilitation();
    await reloadBaseLocale();

    setIsLoading(false);
  };

  // Restart habilitation process, create new habilitation
  const handleReset = () => {
    setStep(0);
    resetHabilitationProcess();
  };

  const handleConfirm = async () => {
    setIsLoadingPublish(true);
    if (habilitation.status === "accepted") {
      await handlePublication();
    }

    setIsLoadingPublish(false);
    handleClose();
  };

  useEffect(() => {
    const step = getStep(habilitation);
    if (step === 2) {
      if (baseLocale.sync) {
        // Skip publication step when renewing accreditation
        handleClose();
      } else {
        checkConflictingRevision();
      }
    }

    setStep(step);
  }, [baseLocale, habilitation, checkConflictingRevision, handleClose]);

  return (
    <Dialog
      isShown
      width={1200}
      preventBodyScrolling
      hasHeader={false}
      intent={isConflicted ? "danger" : "success"}
      hasFooter={step === 2}
      hasCancel={step === 2 && habilitation.status === "accepted"}
      confirmLabel={
        habilitation.status === "accepted"
          ? isConflicted
            ? "Forcer la publication"
            : "Publier"
          : "Fermer"
      }
      cancelLabel="Attendre"
      onConfirm={handleConfirm}
      isConfirmDisabled={isLoadingPublish}
      onCloseComplete={handleClose}
    >
      <Pane>
        {step === 0 && (
          <StrategySelection
            franceconnectAuthenticationUrl={
              habilitation.franceconnectAuthenticationUrl
            }
            emailCommune={habilitation.emailCommune}
            handleStrategy={handleStrategy}
          />
        )}

        {step === 1 && (
          <ValidateAuthentication
            emailCommune={habilitation.emailCommune}
            validatePinCode={handleValidationCode}
            resendCode={sendCode}
            onCancel={handleReset}
          />
        )}

        {step === 2 && habilitation.status === "accepted" && (
          <AcceptedDialog
            {...habilitation}
            baseLocaleId={baseLocale.id}
            commune={commune}
            isConflicted={isConflicted}
          />
        )}

        {step === 2 && habilitation.status === "rejected" && (
          <RejectedDialog
            communeName={commune.nom}
            strategyType={habilitation.strategy.type}
          />
        )}
      </Pane>

      {isLoading && (
        <Pane
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size={42} />
          <Text fontStyle="italic">Chargement…</Text>
        </Pane>
      )}
    </Dialog>
  );
}

export default HabilitationProcess;
