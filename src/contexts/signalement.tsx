"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";

import { Report, ReportsService, Signalement } from "@/lib/openapi-signalement";
import {
  SignalementsService as SignalementsServiceBal,
  UpdateOneReportDTO,
} from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import BalDataContext from "./bal-data";
import TokenContext from "./token";
import { canFetchSignalements } from "@/lib/utils/signalement";

interface SignalementContextType {
  pendingSignalementsCount: number;
  archivedSignalementsCount: number;
  updateManySignalements: (
    ids: string[],
    status: Signalement.status
  ) => Promise<void>;
  updateOneSignalement: (
    id: string,
    reportDTO: UpdateOneReportDTO
  ) => Promise<void>;
  fetchPendingSignalements: (
    limit?: number,
    types?: Report.type[]
  ) => Promise<Report[]>;
  fetchArchivedSignalements: (
    limit?: number,
    types?: Report.type[]
  ) => Promise<Report[]>;
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
    async (limit: number = 100, types?: Report.type[]) => {
      if (!canFetchSignalements(baseLocale, token)) {
        return [];
      }

      const paginatedSignalements = await ReportsService.getReports(
        limit,
        undefined,
        types,
        [Report.status.PENDING],
        undefined,
        [baseLocale.commune]
      );

      setPendingSignalementsCount(paginatedSignalements.total);

      return paginatedSignalements.data as unknown as Report[];
    },
    [baseLocale, token]
  );

  const fetchArchivedSignalements = useCallback(
    async (limit: number = 100, types?: Report.type[]) => {
      if (!canFetchSignalements(baseLocale, token)) {
        return [];
      }

      const paginatedSignalements = await ReportsService.getReports(
        limit,
        undefined,
        types,
        [Report.status.PROCESSED, Report.status.IGNORED],
        undefined,
        [baseLocale.commune]
      );

      setArchivedSignalementsCount(paginatedSignalements.total);

      return paginatedSignalements.data as unknown as Report[];
    },
    [baseLocale, token]
  );

  const fetchSignalementCount = useCallback(async () => {
    await fetchPendingSignalements(1);
    await fetchArchivedSignalements(1);
  }, [fetchPendingSignalements, fetchArchivedSignalements]);

  const updateManySignalements = useCallback(
    async (ids: string[], status: Signalement.status) => {
      await SignalementsServiceBal.updateReports(baseLocale.id, {
        ids,
        status,
      });
      await fetchSignalementCount();
    },
    [baseLocale, fetchSignalementCount]
  );

  const updateOneSignalement = useCallback(
    async (id: string, reportDTO: UpdateOneReportDTO) => {
      await SignalementsServiceBal.updateReport(id, baseLocale.id, reportDTO);
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
      updateManySignalements,
      updateOneSignalement,
      fetchPendingSignalements,
      fetchArchivedSignalements,
    }),
    [
      pendingSignalementsCount,
      archivedSignalementsCount,
      updateManySignalements,
      updateOneSignalement,
      fetchPendingSignalements,
      fetchArchivedSignalements,
    ]
  );

  return <SignalementContext.Provider value={value} {...props} />;
}

export default SignalementContext;
