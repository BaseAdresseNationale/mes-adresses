"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";

import LocalStorageContext from "@/contexts/local-storage";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import { OpenAPI } from "@/lib/openapi-api-bal";

interface TokenContextType {
  token: string | null;
  emails: string[] | null;
  tokenIsChecking: boolean;
  reloadEmails: () => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
}

const TokenContext = React.createContext<TokenContextType | null>(null);

interface TokenContextProviderProps extends ChildrenProps {
  balId: string | null;
}

export function TokenContextProvider({
  balId,
  ...props
}: TokenContextProviderProps) {
  const { getBalToken } = useContext(LocalStorageContext);
  const [tokenIsChecking, setTokenIsChecking] = useState<boolean>(true);
  const [token, setToken] = useState<string>(null);
  const [emails, setEmails] = useState<string[]>(null);

  const verifyToken = useCallback(
    async (token: string) => {
      setTokenIsChecking(true);

      Object.assign(OpenAPI, { TOKEN: token });
      const baseLocale = await BasesLocalesService.findBaseLocale(balId);

      if (baseLocale.token) {
        setToken(baseLocale.token);
        setEmails(baseLocale.emails);
        Object.assign(OpenAPI, { TOKEN: baseLocale.token });
      } else {
        Object.assign(OpenAPI, { TOKEN: null });
        setToken(null);
      }

      setTokenIsChecking(false);
    },
    [balId]
  );

  useEffect(() => {
    async function initializeToken() {
      const tokenStorage: string = getBalToken(balId);
      await verifyToken(tokenStorage);
    }

    initializeToken();

    return () => {
      Object.assign(OpenAPI, { TOKEN: null });
      setToken(null);
    };
  }, [verifyToken, balId, getBalToken]);

  const reloadEmails = useCallback(async () => {
    const token: string = getBalToken(balId);
    await verifyToken(token);
  }, [verifyToken, balId, getBalToken]);

  const value = useMemo(
    () => ({
      token,
      emails,
      reloadEmails,
      tokenIsChecking,
      verifyToken,
    }),
    [token, emails, reloadEmails, tokenIsChecking, verifyToken]
  );

  return <TokenContext.Provider value={value} {...props} />;
}

export const MarkersContextConsumer = TokenContext.Consumer;

export default TokenContext;
