"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import {
  Pane,
  Text,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  ArrowLeftIcon,
  TickCircleIcon,
  ChevronRightIcon,
  CrossIcon,
  defaultTheme,
  Badge,
  Strong,
} from "evergreen-ui";

import {
  AlertVoie,
  AlertNumero,
  AlertModelEnum,
  AlertCodeVoieEnum,
  AlertCodeEnum,
  isAlertCodeVoieEnum,
  isAlertCodeNumeroEnum,
} from "@/lib/alerts/alerts.types";
import {
  AlertVoieDefinitions,
  AlertNumeroDefinitions,
} from "@/lib/alerts/alerts.definitions";
import { isAlertVoieNom } from "@/lib/alerts/utils/alerts-voies.utils";
import {
  ExtendedVoieDTO,
  NumerosService,
  VoiesService,
} from "@/lib/openapi-api-bal";
import BalDataContext from "@/contexts/bal-data";
import AlertsContext from "@/contexts/alerts";
import MapContext from "@/contexts/map";
import LayoutContext from "@/contexts/layout";
import AlertNameDiff from "./alert-name-diff";
import { isAlertNumeroSuffixe } from "@/lib/alerts/utils/alerts-numero.utils";

export interface AlertBatchItem {
  voie: ExtendedVoieDTO;
  alert: AlertVoie | AlertNumero;
  numeroId?: string;
}

interface AlertsBatchProcessorProps {
  items: AlertBatchItem[];
  onClose: () => void;
  onFinish: () => void;
}

function AlertsBatchProcessor({
  items,
  onClose,
  onFinish,
}: AlertsBatchProcessorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {
    baseLocale,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync,
  } = useContext(BalDataContext);
  const { reloadVoieAlerts, reloadNumerosAlerts } = useContext(AlertsContext);
  const { reloadTiles } = useContext(MapContext);
  const { toaster } = useContext(LayoutContext);

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex >= items.length - 1;

  const isVoieNameAlert =
    currentItem?.alert.model === AlertModelEnum.VOIE &&
    isAlertVoieNom(currentItem.alert);
  const isNumeroSuffixeAlert =
    currentItem?.alert.model === AlertModelEnum.NUMERO &&
    isAlertNumeroSuffixe(currentItem.alert);
  const isVoieEmpty =
    currentItem?.alert.model === AlertModelEnum.VOIE &&
    (currentItem?.alert.codes as AlertCodeVoieEnum[]).includes(
      AlertCodeVoieEnum.VOIE_EMPTY
    );
  const hasRemediation =
    Boolean(currentItem?.alert.remediation) &&
    (isVoieNameAlert || isNumeroSuffixeAlert);

  const alertDefinitions = useMemo(() => {
    if (!currentItem) return [];
    return currentItem.alert.codes.map((code) => {
      if (isAlertCodeVoieEnum(code)) {
        return AlertVoieDefinitions[code];
      }
      if (isAlertCodeNumeroEnum(code)) {
        return AlertNumeroDefinitions[code];
      }
      return code;
    });
  }, [currentItem]);

  const goNext = useCallback(() => {
    if (isLastItem) {
      onFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastItem, onFinish]);

  const handleApply = useCallback(async () => {
    if (!currentItem || !hasRemediation) return;

    setIsLoading(true);
    try {
      if (isVoieNameAlert) {
        const applyCorrection = toaster(
          () =>
            VoiesService.updateVoie(currentItem.voie.id, {
              nom: (currentItem.alert as AlertVoie).remediation,
            }),
          "La correction a été appliquée",
          "La correction n'a pas pu être appliquée"
        );
        await applyCorrection();

        const newVoies = await reloadVoies();
        const updatedVoie = newVoies.find(
          ({ id }) => id === currentItem.voie.id
        );
        if (updatedVoie) {
          reloadVoieAlerts(
            updatedVoie,
            (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
          );
        }
      } else if (isNumeroSuffixeAlert && currentItem.numeroId) {
        const applyCorrection = toaster(
          () =>
            NumerosService.updateNumero(currentItem.numeroId, {
              suffixe: (currentItem.alert as AlertNumero).remediation,
            }),
          "Le suffixe a été corrigé",
          "Le suffixe n'a pas pu être corrigé"
        );
        await applyCorrection();

        await reloadNumerosAlerts(
          baseLocale.id,
          (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
        );
      }

      reloadTiles();
      refreshBALSync();
      // Ne pas incrémenter l'index : l'item corrigé va disparaître de la liste
      // et le suivant prendra sa place au même index.
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentItem,
    hasRemediation,
    isVoieNameAlert,
    isNumeroSuffixeAlert,
    toaster,
    reloadVoies,
    reloadVoieAlerts,
    reloadNumerosAlerts,
    reloadTiles,
    refreshBALSync,
    baseLocale.id,
    baseLocale.settings?.ignoredAlertCodes,
  ]);

  const handleConvertToToponyme = useCallback(async () => {
    if (!currentItem || !isVoieEmpty) return;

    setIsLoading(true);
    try {
      const convert = toaster(
        async () => {
          await VoiesService.convertToToponyme(currentItem.voie.id);
          await reloadVoies();
          await reloadToponymes();
          await reloadParcelles();
          reloadVoieAlerts(
            currentItem.voie,
            (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
          );
        },
        "La voie a bien été convertie en toponyme",
        "La voie n'a pas pu être convertie en toponyme"
      );
      await convert();

      reloadTiles();
      refreshBALSync();
      // Ne pas incrémenter l'index : la voie convertie va disparaître de la liste.
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentItem,
    isVoieEmpty,
    toaster,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    reloadVoieAlerts,
    reloadTiles,
    refreshBALSync,
    baseLocale.settings?.ignoredAlertCodes,
  ]);

  if (!currentItem) {
    return (
      <Pane
        padding={16}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size={500} marginBottom={16}>
          Toutes les suggestions ont été traitées
        </Heading>
        <Button onClick={onFinish} appearance="primary">
          Retour à la liste
        </Button>
      </Pane>
    );
  }

  return (
    <Pane display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Pane
        padding={12}
        borderBottom="muted"
        background="white"
        display="flex"
        alignItems="center"
        gap={8}
      >
        <Button
          appearance="minimal"
          iconBefore={ArrowLeftIcon}
          onClick={onClose}
          size="small"
        >
          Retour
        </Button>
        <Badge color="purple">
          {currentIndex + 1} / {items.length}
        </Badge>
      </Pane>

      {/* Content */}
      <Pane flex={1} overflowY="auto" padding={16}>
        <Heading marginBottom={8}>
          {isVoieNameAlert
            ? "Suggestion sur le nom de voie"
            : isVoieEmpty
              ? "Suggestion voie sans adresse"
              : isNumeroSuffixeAlert
                ? "Suggestion sur le suffixe du numero"
                : null}
        </Heading>
        <Text is="p">
          {isVoieNameAlert || isVoieEmpty ? (
            <>{currentItem.voie.nom}</>
          ) : isNumeroSuffixeAlert ? (
            <>
              {(currentItem.alert as AlertNumero).numero}{" "}
              {(currentItem.alert as AlertNumero).value} {currentItem.voie.nom}
            </>
          ) : null}
        </Text>

        {/* Alert descriptions */}
        <Pane
          background={defaultTheme.colors.yellowTint}
          borderLeft={`3px solid ${defaultTheme.colors.orange500}`}
          padding={12}
          borderRadius={4}
          marginBottom={16}
          marginTop={16}
        >
          <UnorderedList>
            {alertDefinitions.map((def, i) => (
              <ListItem key={i} color={defaultTheme.colors.gray900}>
                <Text color={defaultTheme.colors.gray900}>{def}</Text>
              </ListItem>
            ))}
          </UnorderedList>
        </Pane>

        {/* Diff for voie name alerts with remediation */}
        {isVoieNameAlert && hasRemediation && (
          <AlertNameDiff
            fieldLabel="Nom de la voie"
            currentItem={currentItem}
          />
        )}

        {/* Diff for numero suffix alerts with remediation */}
        {isNumeroSuffixeAlert && currentItem.alert.remediation && (
          <AlertNameDiff
            fieldLabel="Suffixe du numéro"
            currentItem={currentItem}
            isNumeroSuffixeAlert
          />
        )}

        {/* Info for VOIE_EMPTY */}
        {isVoieEmpty && (
          <Pane
            background="tint1"
            padding={12}
            borderRadius={4}
            marginBottom={16}
          >
            <Text display="block" marginBottom={8}>
              Cette voie ne contient aucun numéro. Vous pouvez la convertir en
              toponyme.
            </Text>
          </Pane>
        )}

        {/* Info for numero suffix alerts without remediation */}
        {isNumeroSuffixeAlert && !currentItem.alert.remediation && (
          <Pane
            background="tint1"
            padding={12}
            borderRadius={4}
            marginBottom={16}
          >
            <Text display="block" marginBottom={8}>
              Le suffixe &quot;{currentItem.alert.value}&quot; contient des
              caractères invalides.
            </Text>
          </Pane>
        )}
      </Pane>

      {/* Action buttons - sticky bottom */}
      <Pane
        position="sticky"
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        gap={8}
        paddingY={12}
        paddingX={16}
        backgroundColor="#e6e8f0"
        borderTop="muted"
      >
        {hasRemediation && (
          <Button
            isLoading={isLoading}
            onClick={handleApply}
            appearance="primary"
            iconAfter={TickCircleIcon}
            style={{ backgroundColor: defaultTheme.colors.purple600 }}
          >
            Appliquer
          </Button>
        )}
        {isVoieEmpty && (
          <Button
            isLoading={isLoading}
            onClick={handleConvertToToponyme}
            appearance="primary"
            style={{ backgroundColor: defaultTheme.colors.purple600 }}
          >
            Convertir en toponyme
          </Button>
        )}
        <Button
          disabled={isLoading}
          onClick={goNext}
          appearance="default"
          iconAfter={ChevronRightIcon}
          style={{
            color: defaultTheme.colors.purple600,
            borderColor: defaultTheme.colors.purple600,
          }}
        >
          {isLastItem ? "Terminer" : "Passer"}
        </Button>
        <Button
          disabled={isLoading}
          onClick={onClose}
          appearance="minimal"
          iconBefore={CrossIcon}
        >
          Annuler
        </Button>
      </Pane>
    </Pane>
  );
}

export default AlertsBatchProcessor;
