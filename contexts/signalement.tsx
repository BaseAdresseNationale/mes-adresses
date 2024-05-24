import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";

import { BaseLocale } from "@/lib/openapi-api-bal";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
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
    const paginatedSignalements = await SignalementsService.getSignalements(
      undefined,
      undefined,
      [Signalement.status.PENDING],
      undefined,
      undefined,
      [baseLocale.commune]
    );
    setSignalements(paginatedSignalements.data);
  }, [baseLocale.commune]);

  useEffect(() => {
    const signalementWhiteList =
      process.env.NEXT_PUBLIC_SIGNALEMENT_COMMUNES_WHITE_LIST?.split(",") || [];

    const isSignalementEnabled =
      Boolean(process.env.NEXT_PUBLIC_API_SIGNALEMENT) &&
      signalementWhiteList.includes(baseLocale.commune);

    if (!isSignalementEnabled) {
      return;
    }

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
