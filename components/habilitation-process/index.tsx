import { useState, useCallback, useContext, useEffect } from "react";
import Router from "next/router";
import { Dialog, Pane, Text, Spinner } from "evergreen-ui";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

import { ApiDepotService } from "@/lib/api-depot";

import BalDataContext from "@/contexts/bal-data";

import ValidateAuthentication from "@/components/habilitation-process/validate-authentication";
import AcceptedDialog from "@/components/habilitation-process/accepted-dialog";
import RejectedDialog from "@/components/habilitation-process/rejected-dialog";
import {
  BaseLocale,
  BasesLocalesService,
  HabilitationService,
  StrategyDTO,
  HabilitationDTO,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { StrategySelection } from "./strategy-selection";
import { CommuneType } from "@/types/commune";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import PublishBalStep from "./publish-bal-step";

export const PRO_CONNECT_QUERY_PARAM = "pro-connect";

export const StepPublicationEnum = {
  STRATEGY_SELECTION: 0,
  VALIDATE_AUTHENTICATION: 1,
  PUBLISH: 2,
  PUBLISHED: 3,
};

function getStep(habilitation: HabilitationDTO) {
  if (habilitation.status !== HabilitationDTO.status.PENDING) {
    return StepPublicationEnum.PUBLISH;
  }

  if (habilitation.strategy?.type === StrategyDTO.type.EMAIL) {
    return StepPublicationEnum.VALIDATE_AUTHENTICATION;
  }

  return StepPublicationEnum.STRATEGY_SELECTION;
}

interface HabilitationProcessProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
  habilitation: HabilitationDTO;
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
  const [flagURL, setFlagURL] = useState<string | null>(null);
  const [step, setStep] = useState(getStep(habilitation));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPublish, setIsLoadingPublish] = useState(false);
  const [emailSelected, setEmailSelected] = useState<string>(null);
  const { pushToast } = useContext(LayoutContext);
  console.log("step", step, habilitation);
  const { reloadHabilitation, reloadBaseLocale } = useContext(BalDataContext);

  const sendCode = async () => {
    try {
      await HabilitationService.sendPinCodeHabilitation(baseLocale.id, {
        email: emailSelected,
      });
      await reloadHabilitation();

      return true;
    } catch (error) {
      pushToast({
        intent: "danger",
        title: "Le courriel n’a pas pu être envoyé",
        message: error.body?.message,
      });
    }
  };

  const redirectToProConnect = () => {
    const redirectUrl = encodeURIComponent(
      `${EDITEUR_URL}${Router.asPath}?${PRO_CONNECT_QUERY_PARAM}=1`
    );

    const urlProConnect = ApiDepotService.getUrlProConnect(
      habilitation.id,
      redirectUrl
    );
    Router.push(urlProConnect);
  };

  const handleStrategy = async (selectedStrategy: StrategyDTO.type) => {
    setIsLoading(true);
    if (selectedStrategy === StrategyDTO.type.EMAIL) {
      const codeSent = await sendCode();
      if (codeSent) {
        setStep(StepPublicationEnum.VALIDATE_AUTHENTICATION);
      }
    }

    if (selectedStrategy === StrategyDTO.type.PROCONNECT) {
      redirectToProConnect();
    }

    setIsLoading(false);
  };

  const handleValidationCode = async (code: string) => {
    setIsLoading(true);
    try {
      await HabilitationService.validePinCodeHabilitation(baseLocale.id, {
        code,
      });

      // checkConflictingRevision();
      // // SET RESUME BAL IF HABILITATION CODE
      // if (baseLocale.sync?.isPaused == true) {
      //   await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      // }
      setStep(StepPublicationEnum.PUBLISH);
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
    setStep(StepPublicationEnum.STRATEGY_SELECTION);
    resetHabilitationProcess();
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleConfirm = async () => {
    setIsLoadingPublish(true);
    if (habilitation.status === HabilitationDTO.status.ACCEPTED) {
      await wait(2000);
      // await handlePublication();
    }
    setStep(StepPublicationEnum.PUBLISHED);
    setIsLoadingPublish(false);
    // handleClose();
  };

  const fetchCommuneFlag = async () => {
    try {
      const flagUrl = await getCommuneFlagProxy(baseLocale.commune);
      setFlagURL(flagUrl);
    } catch (err) {
      console.error("Error fetching commune flag", err);
      setFlagURL(null);
    }
  };

  useEffect(() => {
    fetchCommuneFlag();
  }, [baseLocale.commune]);

  return (
    <Dialog
      isShown
      width={1200}
      preventBodyScrolling
      hasHeader={false}
      hasFooter={false}
      shouldCloseOnOverlayClick={!isLoadingPublish}
      // intent={isConflicted ? "danger" : "success"}
      // hasFooter={step === 2}
      // hasCancel={
      //   step === 2 && habilitation.status === StatusHabilitationEnum.ACCEPTED
      // }
      // confirmLabel={
      //   habilitation.status === StatusHabilitationEnum.ACCEPTED
      //     ? isConflicted
      //       ? "Forcer la publication"
      //       : "Publier"
      //     : "Fermer"
      // }
      // cancelLabel="Fermer"
      // onConfirm={handleConfirm}
      // isConfirmDisabled={isLoadingPublish}
      onCloseComplete={handleClose}
    >
      <Pane
        marginX="-32px"
        marginY="-8px"
        borderRadius={8}
        background="gray300"
        padding={16}
      >
        {step === 0 && (
          <StrategySelection
            codeCommune={commune.code}
            emailSelected={emailSelected}
            setEmailSelected={setEmailSelected}
            handleStrategy={handleStrategy}
          />
        )}

        {step === 1 && (
          <ValidateAuthentication
            emailCommune={habilitation.emailCommune}
            validatePinCode={handleValidationCode}
            resendCode={sendCode}
            onCancel={handleReset}
            flagURL={flagURL}
          />
        )}

        {step === 2 &&
          habilitation.status === HabilitationDTO.status.ACCEPTED && (
            <PublishBalStep
              baseLocale={baseLocale}
              habilitation={habilitation}
              commune={commune}
              handlePublication={handleConfirm}
              isLoadingPublish={isLoadingPublish}
              flagURL={flagURL}
              handleClose={handleClose}
            />
          )}

        {step === 2 &&
          habilitation.status === HabilitationDTO.status.REJECTED && (
            <RejectedDialog
              communeName={commune.nom}
              strategyType={habilitation.strategy.type}
            />
          )}
        {isLoading && (
          <Pane
            marginTop={16}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size={42} />
            <Text fontStyle="italic">Chargement…</Text>
          </Pane>
        )}
      </Pane>
    </Dialog>
  );
}

export default HabilitationProcess;
