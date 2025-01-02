import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";

import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import { SignalementsService as SignalementsServiceBal } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import BalDataContext from "./bal-data";
import TokenContext from "./token";
import { canFetchSignalements } from "@/lib/utils/signalement";

interface SignalementContextType {
  pendingSignalementsCount: number;
  archivedSignalementsCount: number;
  updateSignalements: (
    ids: string[],
    status: Signalement.status
  ) => Promise<void>;
  fetchPendingSignalements: (
    limit?: number,
    types?: Signalement.type[]
  ) => Promise<Signalement[]>;
  fetchArchivedSignalements: (
    limit?: number,
    types?: Signalement.type[]
  ) => Promise<Signalement[]>;
}

const SignalementContext = React.createContext<SignalementContextType | null>(
  null
);

export function SignalementContextProvider(props: ChildrenProps) {
  const [pendingSignalementsCount, setPendingSignalementsCount] = useState(0);
  const [archivedSignalementsCount, setArchivedSignalementsCount] = useState(0);
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);

  const fetchPendingSignalements = useCallback(
    async (limit: number = 100, types?: Signalement.type[]) => {
      if (!canFetchSignalements(baseLocale, token)) {
        return [];
      }

      const paginatedSignalements = await SignalementsService.getSignalements(
        limit,
        undefined,
        [Signalement.status.PENDING],
        types,
        undefined,
        [baseLocale.commune]
      );

      setPendingSignalementsCount(paginatedSignalements.total);

      return paginatedSignalements.data as unknown as Signalement[];
    },
    [baseLocale, token]
  );

  const fetchArchivedSignalements = useCallback(
    async (limit: number = 100, types?: Signalement.type[]) => {
      if (!canFetchSignalements(baseLocale, token)) {
        return [];
      }

      const paginatedSignalements = await SignalementsService.getSignalements(
        limit,
        undefined,
        [Signalement.status.PROCESSED, Signalement.status.IGNORED],
        types,
        undefined,
        [baseLocale.commune]
      );

      setArchivedSignalementsCount(paginatedSignalements.total);

      return paginatedSignalements.data as unknown as Signalement[];
    },
    [baseLocale, token]
  );

  const fetchSignalementCount = useCallback(async () => {
    await fetchPendingSignalements(1);
    await fetchArchivedSignalements(1);
  }, [fetchPendingSignalements, fetchArchivedSignalements]);

  const updateSignalements = useCallback(
    async (ids: string[], status: Signalement.status) => {
      await SignalementsServiceBal.updateSignalements(baseLocale.id, {
        ids,
        status,
      });
      await fetchSignalementCount();
    },
    [baseLocale, fetchSignalementCount]
  );

  useEffect(() => {
    if (canFetchSignalements(baseLocale, token)) {
      fetchSignalementCount();
    }
  }, [baseLocale, token, fetchSignalementCount]);

  const value = useMemo(
    () => ({
      pendingSignalementsCount,
      archivedSignalementsCount,
      updateSignalements,
      fetchPendingSignalements,
      fetchArchivedSignalements,
    }),
    [
      pendingSignalementsCount,
      archivedSignalementsCount,
      updateSignalements,
      fetchPendingSignalements,
      fetchArchivedSignalements,
    ]
  );

  return <SignalementContext.Provider value={value} {...props} />;
}

export default SignalementContext;
