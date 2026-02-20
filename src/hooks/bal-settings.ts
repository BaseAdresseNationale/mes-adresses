import BalDataContext from "@/contexts/bal-data";
import LayoutContext from "@/contexts/layout";
import TokenContext from "@/contexts/token";
import { useCallback, useContext, useMemo, useState } from "react";
import { isEqual, difference } from "lodash";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { AlertCodeEnum } from "@/lib/alerts/alerts.types";
import AlertsContext from "@/contexts/alerts";

const mailHasChanged = (listA, listB) => {
  return !isEqual(
    [...listA].sort((a, b) => a.localeCompare(b)),
    [...listB].sort((a, b) => a.localeCompare(b))
  );
};

const ignoredAlertCodesHasChanged = (
  listA: AlertCodeEnum[],
  listB: AlertCodeEnum[]
) => {
  return (
    listA.length !== listB.length ||
    !listA.every((code) => listB.includes(code))
  );
};

export function useBALSettings(baseLocale: BaseLocale) {
  const { emails, reloadEmails } = useContext(TokenContext);

  const { reloadBaseLocale, voies } = useContext(BalDataContext);
  const { reloadVoiesAlerts, reloadNumerosAlerts } = useContext(AlertsContext);
  const { pushToast } = useContext(LayoutContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const [nomInput, setNomInput] = useState(baseLocale.nom);
  const [emailsInput, setEmailsInput] = useState(emails || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRenewTokenWarningShown, setIsRenewTokenWarningShown] =
    useState(false);
  const [ignoredAlertCodes, setIgnoredAlertCodes] = useState<AlertCodeEnum[]>(
    (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
  );

  const ignoredAlertCodesChanged = useMemo(
    () =>
      ignoredAlertCodesHasChanged(
        ignoredAlertCodes,
        (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
      ),
    [ignoredAlertCodes, baseLocale.settings?.ignoredAlertCodes]
  );

  const nomHasChanged = useMemo(
    () => nomInput !== baseLocale.nom,
    [nomInput, baseLocale.nom]
  );

  const emailsHaveChanged = useMemo(
    () => mailHasChanged(emails || [], emailsInput),
    [emails, emailsInput]
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        if (nomHasChanged) {
          await BasesLocalesService.updateBaseLocale(baseLocale.id, {
            nom: nomInput.trim(),
          });

          matomoTrackEvent(
            MatomoEventCategory.SETTINGS,
            MatomoEventAction[MatomoEventCategory.SETTINGS].UPDATE_BAL_NAME
          );
        }
        if (emailsHaveChanged) {
          await BasesLocalesService.updateBaseLocale(baseLocale.id, {
            emails: emailsInput,
          });

          await reloadEmails();
          if (difference(emails, emailsInput).length > 0) {
            setIsRenewTokenWarningShown(true);
            matomoTrackEvent(
              MatomoEventCategory.SETTINGS,
              MatomoEventAction[MatomoEventCategory.SETTINGS].REMOVE_ADMIN
            );
          } else {
            matomoTrackEvent(
              MatomoEventCategory.SETTINGS,
              MatomoEventAction[MatomoEventCategory.SETTINGS].ADD_ADMIN
            );
          }
        }
        if (ignoredAlertCodesChanged) {
          await BasesLocalesService.updateBaseLocale(baseLocale.id, {
            settings: {
              ...baseLocale.settings,
              ignoredAlertCodes,
            },
          });
          await reloadVoiesAlerts(voies, ignoredAlertCodes);
          await reloadNumerosAlerts(baseLocale.id, ignoredAlertCodes);
        }
        await reloadBaseLocale();
        pushToast({
          title: "Les paramètres ont été enregistrés avec succès",
          intent: "success",
        });
      } catch (error) {
        setError(error.body?.message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      baseLocale,
      nomInput,
      emailsInput,
      reloadEmails,
      nomHasChanged,
      emailsHaveChanged,
      pushToast,
      reloadBaseLocale,
      emails,
      matomoTrackEvent,
      ignoredAlertCodesChanged,
      ignoredAlertCodes,
      reloadVoiesAlerts,
      voies,
    ]
  );

  return {
    isLoading,
    error,
    isRenewTokenWarningShown,
    emailsInput,
    setEmailsInput,
    nomInput,
    setNomInput,
    onSubmit,
    nomHasChanged,
    emailsHaveChanged,
    setError,
    setIsRenewTokenWarningShown,
    ignoredAlertCodes,
    setIgnoredAlertCodes,
    ignoredAlertCodesChanged,
  };
}
