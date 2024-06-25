import React, { useCallback, useContext, useMemo } from "react";

import { useLocalStorage } from "@/hooks/local-storage";
import { BasesLocalesService, OpenAPI } from "@/lib/openapi";
import { ChildrenProps } from "@/types/context";
import LayoutContext from "./layout";

interface LocalStorageContextType {
  balAccess: Record<string, string>;
  getBalToken: (index: string) => string;
  addBalAccess: (index: string, value: string) => void;
  removeBAL: (balId: string) => Promise<void>;
  wasWelcomed: boolean;
  setWasWelcomed: (value: boolean) => void;
  recoveryEmailSent: Date;
  setRecoveryEmailSent: (value: Date) => void;
  hiddenBal: Record<string, boolean>;
  getHiddenBal: (value: string) => boolean;
  addHiddenBal: (key: string, value: boolean) => void;
  removeHiddenBal: (key: string) => void;
  userSettings: Record<string, any>;
  setUserSettings: (value: Record<string, any>) => void;
}

const LocalStorageContext = React.createContext<LocalStorageContextType | null>(
  null
);

const STORAGE_KEY = "bal-access";
const WELCOMED_KEY = "was-welcomed";
const RECOVERY_EMAIL = "recovery-email-sent";
const VISIBILITY_KEY = "hidden-bal";
const USER_SETTINGS = "user-settings";

export function LocalStorageContextProvider(props: ChildrenProps) {
  const [balAccess, , getBalToken, addBalAccess, removeBalAccess] =
    useLocalStorage(STORAGE_KEY); // Do not assign a default value
  const [wasWelcomed, setWasWelcomed] = useLocalStorage(WELCOMED_KEY);
  const [recoveryEmailSent, setRecoveryEmailSent] =
    useLocalStorage(RECOVERY_EMAIL);
  const { toaster } = useContext(LayoutContext);
  const [hiddenBal, , getHiddenBal, addHiddenBal, removeHiddenBal] =
    useLocalStorage(VISIBILITY_KEY);
  const [userSettings, setUserSettings] = useLocalStorage(USER_SETTINGS);

  const removeBAL = useCallback(async (balId: string) => {
    const token: string = getBalToken(balId);
    Object.assign(OpenAPI, { TOKEN: token });

    const deleteBaseLocale = toaster(
      async () => {
        await BasesLocalesService.deleteBaseLocale(balId);
        Object.assign(OpenAPI, { TOKEN: null });
        removeBalAccess(balId);
      },
      "La Base Adresse Locale a bien été supprimée",
      "La Base Adresse Locale n’a pas pu être supprimée"
    );

    await deleteBaseLocale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      balAccess,
      getBalToken,
      addBalAccess,
      removeBAL,
      wasWelcomed,
      setWasWelcomed,
      recoveryEmailSent,
      setRecoveryEmailSent,
      hiddenBal,
      getHiddenBal,
      addHiddenBal,
      removeHiddenBal,
      userSettings,
      setUserSettings,
    }),
    [
      balAccess,
      getBalToken,
      addBalAccess,
      removeBAL,
      wasWelcomed,
      setWasWelcomed,
      recoveryEmailSent,
      setRecoveryEmailSent,
      hiddenBal,
      getHiddenBal,
      addHiddenBal,
      removeHiddenBal,
      userSettings,
      setUserSettings,
    ]
  );

  return <LocalStorageContext.Provider value={value} {...props} />;
}

export const LocalStorageContextConsumer = LocalStorageContext.Consumer;

export default LocalStorageContext;
