import { useState, useContext, Dispatch, SetStateAction } from "react";

import { getBANCommune } from "@/lib/api-ban";
import BalDataContext from "@/contexts/bal-data";
import { BasesLocalesService, HabilitationService } from "@/lib/openapi";
import { CommuneType } from "@/types/commune";
import { BaseLocale } from "@/lib/openapi";
import LayoutContext from "@/contexts/layout";

interface UsePublishProcess {
  massDeletionConfirm: null | (() => void);
  setMassDeletionConfirm: Dispatch<SetStateAction<() => void>>;
  handleChangeStatus: (status: BaseLocale.status) => Promise<any>;
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
    isHabilitationValid,
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

  const handleChangeStatus = async (status: BaseLocale.status) => {
    const updated = await BasesLocalesService.updateBaseLocale(baseLocale._id, {
      status,
    });
    await reloadBaseLocale();

    return updated;
  };

  const handleShowHabilitationProcess = async () => {
    const isReadyToPublish = [
      BaseLocale.status.DRAFT,
      BaseLocale.status.PUBLISHED,
      BaseLocale.status.REPLACED,
    ].includes(baseLocale.status);

    if (
      isReadyToPublish &&
      (!habilitation || !isHabilitationValid) &&
      !commune.isCOM
    ) {
      try {
        const habilitation = await HabilitationService.createHabilitation(
          baseLocale._id
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
    const publishBaseLocale = toaster(
      () => BasesLocalesService.publishBaseLocale(baseLocale._id),
      "La Base Adresses Nationale a bien été mise à jour",
      "Impossible de mettre à jour la Base Adresses Nationale"
    );
    await publishBaseLocale();
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
    handleChangeStatus,
    handleShowHabilitationProcess,
    handlePublication,
  };
}
