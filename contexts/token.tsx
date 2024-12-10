import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import Router from "next/router";

import LocalStorageContext from "@/contexts/local-storage";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import { OpenAPI } from "@/lib/openapi-api-bal";

interface TokenContextType {
  token: string | null;
  emails: string[] | null;
  tokenIsChecking: boolean;
  reloadEmails: () => Promise<void>;
}

const TokenContext = React.createContext<TokenContextType | null>(null);

interface TokenContextProviderProps extends ChildrenProps {
  balId: string | null;
  _token: string | null;
}

export function TokenContextProvider({
  balId,
  _token,
  ...props
}: TokenContextProviderProps) {
  const { getBalToken, addBalAccess } = useContext(LocalStorageContext);

  const [tokenIsChecking, setTokenIsChecking] = useState<boolean>(false);
  const [token, setToken] = useState<string>(null);
  const [emails, setEmails] = useState<string[]>(null);

  const verify = useCallback(
    async (token: string) => {
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
    if (balId) {
      setTokenIsChecking(true);
      if (_token) {
        addBalAccess(balId, _token);
        void Router.push(`/bal/${balId}`);
      } else {
        const tokenStorage: string = getBalToken(balId);
        void verify(tokenStorage);
      }
    } else {
      Object.assign(OpenAPI, { TOKEN: null });
      setToken(null);
    }
  }, [verify, balId, _token, addBalAccess, getBalToken]);

  const reloadEmails = useCallback(async () => {
    const token: string = getBalToken(balId);
    await verify(token);
  }, [verify, balId, getBalToken]);

  const value = useMemo(
    () => ({
      token,
      emails,
      reloadEmails,
      tokenIsChecking,
    }),
    [token, emails, reloadEmails, tokenIsChecking]
  );

  return <TokenContext.Provider value={value} {...props} />;
}

export const MarkersContextConsumer = TokenContext.Consumer;

export default TokenContext;
