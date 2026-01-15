"use client";

import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Dialog, Pane, Text, Spinner } from "evergreen-ui";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

import { ApiDepotService } from "@/lib/api-depot";

import BalDataContext from "@/contexts/bal-data";

import {
  BaseLocale,
  HabilitationService,
  StrategyDTO,
  HabilitationDTO,
  BasesLocalesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { StrategySelectionStep } from "./strategy-selection";
import { CommuneType } from "@/types/commune";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import AuthenticationRejectedStep from "@/components/habilitation-process/steps/authentication_rejected";
import PublishBalStep from "./steps/publish-bal";
import PublishedBalStep from "./steps/published-bal";
import PublishBalRejectedStep from "./steps/publish-bal-rejected";
import AuthenticationValidateStep from "./steps/validate-authentication";

export const PRO_CONNECT_QUERY_PARAM = "pro-connect";

export const StepPublicationEnum = {
  STRATEGY_SELECTION: 0,
  AUTHENTICATION_VALIDATE: 1,
  AUTHENTICATION_REJECTED: 2,
  PUBLISH_BAL: 3,
  PUBLISH_BAL_REJECTED: 4,
  PUBLISHED_BAL: 5,
};

function getStep(habilitation: HabilitationDTO) {
  if (habilitation?.status === HabilitationDTO.status.REJECTED) {
    return StepPublicationEnum.AUTHENTICATION_REJECTED;
  }

  if (habilitation?.status === HabilitationDTO.status.ACCEPTED) {
    return StepPublicationEnum.PUBLISH_BAL;
  }

  if (habilitation?.strategy?.type === StrategyDTO.type.EMAIL) {
    return StepPublicationEnum.AUTHENTICATION_VALIDATE;
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { pushToast } = useContext(LayoutContext);
  const { reloadHabilitation, reloadBaseLocale } = useContext(BalDataContext);
  const router = useRouter();
  const pathname = usePathname();

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
      `${EDITEUR_URL}${pathname}?${PRO_CONNECT_QUERY_PARAM}=1`
    );

    const urlProConnect = ApiDepotService.getUrlProConnect(
      habilitation.id,
      redirectUrl
    );

    router.push(urlProConnect);
  };

  const handleStrategy = async (selectedStrategy: StrategyDTO.type) => {
    setIsLoading(true);
    if (selectedStrategy === StrategyDTO.type.EMAIL) {
      const codeSent = await sendCode();
      if (codeSent) {
        setStep(StepPublicationEnum.AUTHENTICATION_VALIDATE);
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

      // SET RESUME BAL IF HABILITATION CODE
      if (baseLocale.sync?.isPaused == true) {
        await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      }
      setStep(StepPublicationEnum.PUBLISH_BAL);
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

  const handleConfirm = useCallback(async () => {
    setIsLoadingPublish(true);
    if (habilitation.status === HabilitationDTO.status.ACCEPTED) {
      try {
        await handlePublication();
        // eslint-disable-next-line react-hooks/immutability
        baseLocale.status = BaseLocale.status.PUBLISHED;
      } catch (error) {
        console.error("Error handling publication", error);
      }
    }
    setIsLoadingPublish(false);

    if (baseLocale.status === BaseLocale.status.PUBLISHED) {
      setStep(StepPublicationEnum.PUBLISHED_BAL);
    } else {
      setStep(StepPublicationEnum.PUBLISH_BAL_REJECTED);
    }
  }, [baseLocale, habilitation.status, handlePublication]);

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
      onCloseComplete={handleClose}
    >
      <Pane
        ref={wrapperRef}
        marginX="-32px"
        marginY="-8px"
        borderRadius={8}
        background="gray300"
        padding={16}
      >
        {step === StepPublicationEnum.STRATEGY_SELECTION && (
          <StrategySelectionStep
            codeCommune={commune.code}
            emailSelected={emailSelected}
            setEmailSelected={setEmailSelected}
            handleStrategy={handleStrategy}
          />
        )}

        {step === StepPublicationEnum.AUTHENTICATION_VALIDATE && (
          <AuthenticationValidateStep
            emailCommune={habilitation.emailCommune}
            validatePinCode={handleValidationCode}
            resendCode={sendCode}
            onCancel={handleReset}
            flagURL={flagURL}
          />
        )}

        {step === StepPublicationEnum.AUTHENTICATION_REJECTED &&
          habilitation.status === HabilitationDTO.status.REJECTED && (
            <AuthenticationRejectedStep
              communeName={commune.nom}
              strategyType={habilitation.strategy.type}
              handleClose={handleClose}
            />
          )}

        {step === StepPublicationEnum.PUBLISH_BAL &&
          habilitation.status === HabilitationDTO.status.ACCEPTED && (
            <PublishBalStep
              baseLocale={baseLocale}
              commune={commune}
              handlePublication={handleConfirm}
              isLoadingPublish={isLoadingPublish}
              handleClose={handleClose}
            />
          )}

        {step === StepPublicationEnum.PUBLISH_BAL_REJECTED && (
          <PublishBalRejectedStep handleClose={handleClose} />
        )}
        {step === StepPublicationEnum.PUBLISHED_BAL && (
          <PublishedBalStep
            commune={commune}
            handleClose={handleClose}
            dialogWidth={wrapperRef?.current?.offsetWidth}
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
