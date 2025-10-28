import { useState, useContext, Dispatch, SetStateAction } from "react";

import { getBANCommune } from "@/lib/api-ban";
import BalDataContext from "@/contexts/bal-data";
import {
  BasesLocalesService,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi-api-bal";
import { BaseLocale } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";

interface UsePublishProcess {
  massDeletionConfirm: null | (() => void);
  setMassDeletionConfirm: Dispatch<SetStateAction<() => void>>;
  handleShowHabilitationProcess: () => Promise<void>;
  handlePublication: () => Promise<void>;
}

export default function usePublishProcess(
  commune: CommuneType
): UsePublishProcess {
  const [massDeletionConfirm, setMassDeletionConfirm] = useState<
    null | (() => void)
  >(null);

  const {
    baseLocale,
    habilitation,
    reloadBaseLocale,
    reloadHabilitation,
    setIsHabilitationProcessDisplayed,
  } = useContext(BalDataContext);

  const { toaster, pushToast } = useContext(LayoutContext);

  const checkMassDeletion = async () => {
    try {
      const communeBAN = await getBANCommune(commune.code);
      return (baseLocale.nbNumeros / communeBAN.nbNumeros) * 100 <= 50;
    } catch (error) {
      pushToast({
        title: "Erreur",
        message:
          "Impossible de récupérer les données de la Base Adresse Nationale",
        intent: "danger",
      });

      return false;
    }
  };

  const handleShowHabilitationProcess = async () => {
    const isReadyToPublish = [
      BaseLocale.status.DRAFT,
      BaseLocale.status.PUBLISHED,
      BaseLocale.status.REPLACED,
    ].includes(baseLocale.status);

    if (
      isReadyToPublish &&
      (!habilitation ||
        habilitation.status !== HabilitationDTO.status.ACCEPTED) &&
      !commune.isCOM
    ) {
      try {
        const habilitation = await HabilitationService.createHabilitation(
          baseLocale.id
        );

        if (habilitation) {
          await reloadHabilitation();
        }
      } catch (err) {
        pushToast({
          title: "Erreur",
          message: "Impossible de créer un processus d'habilitation",
          intent: "danger",
        });
      }
    }

    setIsHabilitationProcessDisplayed(isReadyToPublish);
  };

  const handleSync = async () => {
    await BasesLocalesService.publishBaseLocale(baseLocale.id);
    await reloadBaseLocale();
  };

  const handlePublication = async () => {
    const isMassDeletionDetected = await checkMassDeletion();

    if (isMassDeletionDetected) {
      setMassDeletionConfirm(() => handleSync);
    } else {
      await handleSync();
    }
  };

  return {
    massDeletionConfirm,
    setMassDeletionConfirm,
    handleShowHabilitationProcess,
    handlePublication,
  };
}
