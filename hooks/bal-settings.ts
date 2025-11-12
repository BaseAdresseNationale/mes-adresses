import BalDataContext from "@/contexts/bal-data";
import LayoutContext from "@/contexts/layout";
import TokenContext from "@/contexts/token";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useInput } from "./input";
import { isEqual, difference } from "lodash";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import { validateEmail } from "@/lib/utils/email";
import LocalStorageContext from "@/contexts/local-storage";

const mailHasChanged = (listA, listB) => {
  return !isEqual(
    [...listA].sort((a, b) => a.localeCompare(b)),
    [...listB].sort((a, b) => a.localeCompare(b))
  );
};

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

export function useBALSettings(baseLocale: BaseLocale, token?: string) {
  const { emails, reloadEmails } = useContext(TokenContext);
  const { reloadBaseLocale } = useContext(BalDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [balEmails, setBalEmails] = useState([]);
  const [email, onEmailChange, resetEmail] = useInput();
  const [error, setError] = useState("");
  const [isRenewTokenWarningShown, setIsRenewTokenWarningShown] =
    useState(false);
  const [nomInput, onNomInputChange] = useInput(baseLocale.nom);

  const { userSettings, setUserSettings } = useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);

  const [userSettingsForm, setUserSettingsForm] = useState(userSettings);

  const urlAdminBal = useMemo(() => {
    return `${EDITEUR_URL}/bal/${baseLocale.id}/${token}`;
  }, [baseLocale.id, token]);

  useEffect(() => {
    setBalEmails(emails || []);
  }, [emails]);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRemoveEmail = useCallback((email) => {
    setBalEmails((emails) => emails.filter((e) => e !== email));
  }, []);

  const onAddEmail = useCallback(() => {
    if (validateEmail(email)) {
      setBalEmails((emails) => [...emails, email]);
      resetEmail();
    } else {
      setError("Cet email n’est pas valide");
    }
  }, [email, resetEmail]);

  const onSubmitBALEmails = useCallback(async () => {
    try {
      await BasesLocalesService.updateBaseLocale(baseLocale.id, {
        emails: balEmails,
      });

      await reloadEmails();
      await reloadBaseLocale();

      if (
        mailHasChanged(emails || [], balEmails) &&
        difference(emails, balEmails).length > 0
      ) {
        setIsRenewTokenWarningShown(true);
      }
    } catch (error) {
      setError(error.body?.message);
    }
  }, [baseLocale.id, balEmails, reloadEmails, reloadBaseLocale, emails]);

  const nomHasChanged = useMemo(
    () => nomInput !== baseLocale.nom,
    [nomInput, baseLocale.nom]
  );

  const emailsHaveChanged = useMemo(
    () => mailHasChanged(emails || [], balEmails),
    [emails, balEmails]
  );

  const userSettingsHasChanged = useMemo(
    () => JSON.stringify(userSettingsForm) !== JSON.stringify(userSettings),
    [userSettingsForm, userSettings]
  );

  const onSubmitNomBaseLocale = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    await BasesLocalesService.updateBaseLocale(baseLocale.id, {
      nom: nomInput.trim(),
    });
    reloadBaseLocale();
    setIsLoading(false);
  }, [baseLocale.id, nomInput, reloadBaseLocale]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (nomHasChanged) {
          await onSubmitNomBaseLocale();
        }
        if (userSettingsHasChanged) {
          setUserSettings(userSettingsForm);
        }
        if (emailsHaveChanged) {
          await onSubmitBALEmails();
        }
        pushToast({
          title: "Les paramètres ont été enregistrées avec succès",
          intent: "success",
        });
      } catch (error) {
        setError(error.body?.message);
      }
    },
    [
      nomHasChanged,
      userSettingsHasChanged,
      emailsHaveChanged,
      userSettingsForm,
      pushToast,
      onSubmitNomBaseLocale,
      setUserSettings,
      onSubmitBALEmails,
    ]
  );

  return {
    isLoading,
    balEmails,
    email,
    error,
    isRenewTokenWarningShown,
    nomInput,
    onEmailChange,
    onRemoveEmail,
    onAddEmail,
    onSubmit,
    onNomInputChange,
    urlAdminBal,
    userSettingsForm,
    setUserSettingsForm,
    nomHasChanged,
    userSettingsHasChanged,
    emailsHaveChanged,
    setError,
    setIsRenewTokenWarningShown,
  };
}
