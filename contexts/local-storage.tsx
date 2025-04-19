import React, { useMemo } from "react";

import { useLocalStorage } from "@/hooks/local-storage";
import { ChildrenProps } from "@/types/context";

interface LocalStorageContextType {
  balAccess: Record<string, string>;
  getBalToken: (index: string) => string;
  addBalAccess: (index: string, value: string) => void;
  wasWelcomed: boolean;
  setWasWelcomed: (value: boolean) => void;
  recoveryEmailSent: Date;
  setRecoveryEmailSent: (value: Date) => void;
  userSettings: Record<string, any>;
  setUserSettings: (value: Record<string, any>) => void;
  productTour: Record<string, boolean>;
  setProductTour: (value: Record<string, boolean>) => void;
  lastNewsSeen: string;
  setLastNewsSeen: (value: string) => void;
  removeBalAccess: (index: string) => void;
}

const LocalStorageContext = React.createContext<LocalStorageContextType | null>(
  null
);

const STORAGE_KEY = "bal-access";
const WELCOMED_KEY = "was-welcomed";
const RECOVERY_EMAIL = "recovery-email-sent";
const USER_SETTINGS = "user-settings";
const PRODUCT_TOUR = "product-tour";
const LAST_NEWS_SEEN = "last-news-seen";

export function LocalStorageContextProvider(props: ChildrenProps) {
  const [balAccess, , getBalToken, addBalAccess, removeBalAccess] =
    useLocalStorage(STORAGE_KEY); // Do not assign a default value
  const [wasWelcomed, setWasWelcomed] = useLocalStorage(WELCOMED_KEY);
  const [recoveryEmailSent, setRecoveryEmailSent] =
    useLocalStorage(RECOVERY_EMAIL);
  const [userSettings, setUserSettings] = useLocalStorage(USER_SETTINGS);
  const [productTour, setProductTour] = useLocalStorage(PRODUCT_TOUR);
  const [lastNewsSeen, setLastNewsSeen] = useLocalStorage(LAST_NEWS_SEEN);

  const value = useMemo(
    () => ({
      balAccess,
      getBalToken,
      addBalAccess,
      wasWelcomed,
      setWasWelcomed,
      recoveryEmailSent,
      setRecoveryEmailSent,
      userSettings,
      setUserSettings,
      productTour,
      setProductTour,
      lastNewsSeen,
      setLastNewsSeen,
      removeBalAccess,
    }),
    [
      balAccess,
      getBalToken,
      addBalAccess,
      wasWelcomed,
      setWasWelcomed,
      recoveryEmailSent,
      setRecoveryEmailSent,
      userSettings,
      setUserSettings,
      productTour,
      setProductTour,
      lastNewsSeen,
      setLastNewsSeen,
      removeBalAccess,
    ]
  );

  return <LocalStorageContext.Provider value={value} {...props} />;
}

export const LocalStorageContextConsumer = LocalStorageContext.Consumer;

export default LocalStorageContext;
