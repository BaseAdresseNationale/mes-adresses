import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";

import { BaseLocale } from "@/lib/openapi";
import {
  Signalement,
  DefaultService as SignalementService,
} from "@/lib/openapi-signalement";
import { ChildrenProps } from "@/types/context";
import BalDataContext from "./bal-data";
import TokenContext from "./token";

interface SignalementContextType {
  signalements: Signalement[];
}

const SignalementContext = React.createContext<SignalementContextType | null>(
  null
);

export function SignalementContextProvider(props: ChildrenProps) {
  const [signalements, setSignalements] = useState([]);
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);

  const fetchSignalements = useCallback(async () => {
    const signalements = await SignalementService.getSignalementsByCodeCommune(
      baseLocale.commune
    );
    setSignalements(signalements);
  }, [baseLocale.commune]);

  useEffect(() => {
    const canGetSignalement =
      baseLocale.status === BaseLocale.status.PUBLISHED && Boolean(token);

    if (canGetSignalement) {
      fetchSignalements();
    }
  }, [baseLocale, token, fetchSignalements]);

  const value = useMemo(
    () => ({
      signalements,
    }),
    [signalements]
  );

  return <SignalementContext.Provider value={value} {...props} />;
}

export default SignalementContext;
