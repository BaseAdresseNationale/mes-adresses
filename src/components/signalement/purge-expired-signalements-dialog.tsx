"use client";

import { Button, Dialog, Heading, Pane, Paragraph } from "evergreen-ui";
import { useContext, useState } from "react";
import ProgressBar from "../progress-bar";
import LayoutContext from "@/contexts/layout";
import {
  getAllSignalements,
  getExistingLocation,
} from "@/lib/utils/signalement";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import { SignalementsService as SignalementsServiceBal } from "@/lib/openapi-api-bal";
import { Signalement } from "@/lib/openapi-signalement";
import SignalementContext from "@/contexts/signalement";

interface PurgeExpiredSignalementsDialogProps {
  baseLocale: ExtendedBaseLocaleDTO;
  isShown: boolean;
  onClose: () => void;
}

export function PurgeExpiredSignalementsDialog({
  baseLocale,
  isShown,
  onClose,
}: PurgeExpiredSignalementsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { pushToast } = useContext(LayoutContext);
  const { fetchPendingSignalements } = useContext(SignalementContext);
  const [progress, setProgress] = useState(0);

  const handlePurge = async () => {
    setIsLoading(true);
    try {
      const allPendingSignalements = await getAllSignalements(
        [Signalement.status.PENDING],
        undefined,
        undefined,
        [baseLocale.commune]
      );
      const allVoies = await BasesLocalesService.findBaseLocaleVoies(
        baseLocale.id
      );
      const allToponymes = await BasesLocalesService.findBaseLocaleToponymes(
        baseLocale.id
      );
      let totalCount = 0;
      let purgedSignalementsCount = 0;

      for (const pendingSignalement of allPendingSignalements) {
        let signalementLocation = null;
        const isNewVoieCreation =
          pendingSignalement.type === Signalement.type.LOCATION_TO_CREATE &&
          pendingSignalement.existingLocation === null;

        try {
          signalementLocation = await getExistingLocation(
            pendingSignalement,
            allVoies,
            allToponymes
          );
        } catch (error) {
          console.error(
            `Error getting existing location for signalement ${pendingSignalement.id}:`,
            error
          );
        }

        if (!signalementLocation && !isNewVoieCreation) {
          await SignalementsServiceBal.updateSignalements(baseLocale.id, {
            ids: [pendingSignalement.id],
            status: Signalement.status.EXPIRED,
          });
          purgedSignalementsCount++;
        }
        totalCount++;
        setProgress(
          Math.round((totalCount / allPendingSignalements.length) * 100)
        );
      }

      pushToast({
        title: "Succès",
        message: `${purgedSignalementsCount} signalement(s) expiré(s) ont été retirés de la liste.`,
        intent: "success",
      });
    } catch (error) {
      console.error("Failed to purge expired signalements:", error);
      pushToast({
        title: "Erreur",
        message:
          "Une erreur est survenue lors de l'actualisation des signalements. Veuillez réessayer ultérieurement.",
        intent: "danger",
      });
    } finally {
      setIsLoading(false);
      onClose();
      // Refresh pending signalements count
      await fetchPendingSignalements(1);
    }
  };

  return (
    <Dialog
      isShown={isShown}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={onClose}
      {...(isLoading && {
        shouldCloseOnEscapePress: false,
        shouldCloseOnOverlayClick: false,
      })}
    >
      <Pane paddingY={16}>
        <Heading is="h4" size={600}>
          Actualisation des signalements
        </Heading>
      </Pane>
      {isLoading ? (
        <>
          <Paragraph>
            Cette opération peut prendre un certain temps, merci de patienter.
          </Paragraph>
          <Pane marginBottom={16}>
            <ProgressBar percent={progress} />
          </Pane>
        </>
      ) : (
        <>
          <Paragraph>
            Si vous avez fait des modifications sur votre Base Adresse Locale
            telles que des suppressions ou des renommages de voie, certains
            signalements peuvent être devenus obsolètes.
          </Paragraph>
          <Paragraph marginTop={8}>
            En les actualisant, les signalements obsolètes seront retirés de la
            liste.
          </Paragraph>
          <Pane marginY={16} display="flex" justifyContent="flex-end">
            <Button marginRight={16} appearance="primary" onClick={handlePurge}>
              Actualiser les signalements
            </Button>
            <Button appearance="default" onClick={onClose}>
              Fermer
            </Button>
          </Pane>
        </>
      )}
    </Dialog>
  );
}
