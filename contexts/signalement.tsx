import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";

import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import { ChildrenProps } from "@/types/context";
import BalDataContext from "./bal-data";
import TokenContext from "./token";
import { canFetchSignalements } from "@/lib/utils/signalement";

export type SignalementCounts = { pending: number; archived: number };
interface SignalementContextType {
  signalementCounts: SignalementCounts;
}

const SignalementContext = React.createContext<SignalementContextType | null>(
  null
);

export function SignalementContextProvider(props: ChildrenProps) {
  const [signalementCounts, setSignalementCounts] = useState<SignalementCounts>(
    {
      pending: 0,
      archived: 0,
    }
  );
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);

  const fetchSignalementCount = useCallback(async () => {
    const pendingCount = await SignalementsService.getSignalements(
      1,
      undefined,
      [Signalement.status.PENDING],
      undefined,
      undefined,
      [baseLocale.commune]
    );
    const archivedCount = await SignalementsService.getSignalements(
      1,
      undefined,
      [Signalement.status.PROCESSED, Signalement.status.EXPIRED],
      undefined,
      undefined,
      [baseLocale.commune]
    );

    setSignalementCounts({
      pending: pendingCount.total,
      archived: archivedCount.total,
    });
  }, [baseLocale.commune]);

  useEffect(() => {
    if (canFetchSignalements(baseLocale, token)) {
      fetchSignalementCount();
    }
  }, [baseLocale, token, fetchSignalementCount]);

  const value = useMemo(
    () => ({
      signalementCounts,
    }),
    [signalementCounts]
  );

  return <SignalementContext.Provider value={value} {...props} />;
}

export default SignalementContext;
