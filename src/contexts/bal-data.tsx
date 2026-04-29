"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { union } from "lodash";

import {
  HabilitationDTO,
  Numero,
  Toponyme,
  Voie,
  BasesLocalesService,
  VoiesService,
  ToponymesService,
  BaseLocaleSync,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  ExtendedVoieDTO,
} from "@/lib/openapi-api-bal";
import TokenContext from "@/contexts/token";
import MatomoTrackingContext from "@/contexts/matomo-tracking";
import useHabilitation from "@/hooks/habilitation";
import LayoutContext from "./layout";
import { ApiDepotService, PRO_CONNECT_QUERY_PARAM } from "@/lib/api-depot";
import { CommuneType } from "@/types/commune";
import { getCommuneWithBBox } from "@/lib/commune";
import { Pane, Paragraph, Spinner } from "evergreen-ui";
import { useSearchParams } from "next/navigation";
import { AlertCodeEnum } from "@/lib/alerts/alerts.types";
import AlertsContext from "./alerts";
import BALRecoveryContext from "./bal-recovery";

interface BALDataContextType {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editingId: string | null;
  setEditingId: (isEditing: string | null) => void;
  editingItem: Voie | Toponyme | Numero;
  baseLocale: ExtendedBaseLocaleDTO;
  reloadBaseLocale: () => Promise<ExtendedBaseLocaleDTO>;
  habilitation: HabilitationDTO;
  reloadHabilitation: () => Promise<void>;
  parcelles: Array<string>;
  reloadParcelles: () => Promise<void>;
  setVoies: React.Dispatch<React.SetStateAction<ExtendedVoieDTO[]>>;
  voie: Voie;
  setVoie: React.Dispatch<React.SetStateAction<Voie>>;
  toponyme: Toponyme;
  setToponyme: (Toponyme: Toponyme) => void;
  numeros: Array<Numero>;
  reloadNumeros: () => Promise<void>;
  voies: ExtendedVoieDTO[];
  reloadVoies: () => Promise<ExtendedVoieDTO[]>;
  toponymes: ExtentedToponymeDTO[];
  reloadToponymes: () => Promise<void>;
  isRefrehSyncStat: boolean;
  refreshBALSync: () => Promise<void>;
  habilitationIsLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: (
    isHabilitationProcessDisplayed: boolean
  ) => void;
  reloadVoieNumeros: (voieId: string) => Promise<void>;
  commune: CommuneType | null;
  setNumeros: React.Dispatch<React.SetStateAction<Numero[]>>;
  reloadVoiesAlerts: (overrideCodes?: AlertCodeEnum[]) => Promise<void>;
  reloadVoieAlerts: (voie: ExtendedVoieDTO) => Promise<void>;
  reloadNumerosAlerts: (overrideCodes?: AlertCodeEnum[]) => Promise<void>;
}

const BalDataContext = React.createContext<BALDataContextType | null>(null);

interface BalDataContextProviderProps {
  initialBaseLocale: ExtendedBaseLocaleDTO;
  children: React.ReactNode;
}

export function BalDataContextProvider({
  initialBaseLocale,
  children,
}: BalDataContextProviderProps) {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, _setEditingId] = useState<string>(null);
  const [parcelles, setParcelles] = useState<Array<string>>([]);
  const [numeros, setNumeros] = useState<Array<Numero>>([]);
  const [voies, setVoies] = useState<ExtendedVoieDTO[]>([]);
  const [toponymes, setToponymes] = useState<ExtentedToponymeDTO[]>([]);
  const [commune, setCommune] = useState<CommuneType | null>(null);
  const [voie, setVoie] = useState<Voie | undefined>();
  const [toponyme, setToponyme] = useState<Toponyme | undefined>();
  const [baseLocale, setBaseLocale] =
    useState<ExtendedBaseLocaleDTO>(initialBaseLocale);
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState<boolean>(false);
  const { pushToast } = useContext(LayoutContext);
  const { token } = useContext(TokenContext);
  const { setBaseLocale: setMatomoBaseLocale } = useContext(
    MatomoTrackingContext
  );
  const [isBALDataLoaded, setIsBALDataLoaded] = useState<boolean>(false);
  const { setOtherBalIdPublished } = useContext(BALRecoveryContext);
  const { reloadVoiesAlerts, reloadVoieAlerts, reloadNumerosAlerts } =
    useContext(AlertsContext);

  // Sync baseLocale to Matomo tracking context
  useEffect(() => {
    setMatomoBaseLocale(baseLocale);
  }, [baseLocale, setMatomoBaseLocale]);

  // Clear Matomo baseLocale on unmount only
  useEffect(() => {
    return () => setMatomoBaseLocale(null);
  }, [setMatomoBaseLocale]);

  const _setBalAlreadyPublished = useCallback(async (codeCommune) => {
    try {
      const revision = await ApiDepotService.getCurrentRevision(codeCommune);
      const otherBalIdPublished = revision.context?.extras?.balId
        ? revision.context?.extras?.balId !== baseLocale.id
          ? revision.context?.extras?.balId
          : null
        : null;
      setOtherBalIdPublished(otherBalIdPublished);
    } catch (error) {
      console.error(
        "ERROR: Impossible de récupérer les révisions pour cette commune",
        error.body
      );
    }
  }, []);

  useEffect(() => {
    async function fetchBALData() {
      try {
        const voies = await BasesLocalesService.findBaseLocaleVoies(
          initialBaseLocale.id
        );
        const toponymes = await BasesLocalesService.findBaseLocaleToponymes(
          initialBaseLocale.id
        );
        const commune = await getCommuneWithBBox(initialBaseLocale, voies);
        if (!initialBaseLocale.settings.otherBalPublishedIgnored) {
          await _setBalAlreadyPublished(commune.code);
        }
        setVoies(voies);
        setToponymes(toponymes);
        setCommune(commune);
        setIsBALDataLoaded(true);
        // LOAD ALERTS
        reloadVoiesAlerts(
          voies,
          (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
        );
        reloadNumerosAlerts(
          initialBaseLocale.id,
          (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
        );
      } catch (error) {
        console.error("Error fetching BAL data:", error);
      }
    }

    if (!isBALDataLoaded) {
      fetchBALData();
    }
  }, [
    _setBalAlreadyPublished,
    baseLocale.settings?.ignoredAlertCodes,
    initialBaseLocale,
    isBALDataLoaded,
    reloadNumerosAlerts,
    reloadVoiesAlerts,
  ]);

  const {
    habilitation,
    reloadHabilitation,
    isLoading: habilitationIsLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  } = useHabilitation(initialBaseLocale, token);

  const reloadParcelles = useCallback(async () => {
    const parcelles: Array<string> =
      await BasesLocalesService.findBaseLocaleParcelles(baseLocale.id);
    setParcelles(parcelles);
  }, [baseLocale.id]);

  const reloadVoies = useCallback(async (): Promise<ExtendedVoieDTO[]> => {
    const voies: ExtendedVoieDTO[] =
      await BasesLocalesService.findBaseLocaleVoies(baseLocale.id);
    setVoies(voies);
    return voies;
  }, [baseLocale.id]);

  const reloadToponymes = useCallback(async () => {
    const toponymes: ExtentedToponymeDTO[] =
      await BasesLocalesService.findBaseLocaleToponymes(baseLocale.id);
    setToponymes(toponymes);
  }, [baseLocale.id]);

  const reloadVoieNumeros = useCallback(async (voieId: string) => {
    const numeros: Numero[] = await VoiesService.findVoieNumeros(voieId);
    setNumeros(numeros);
  }, []);

  const reloadNumeros = useCallback(async () => {
    let numeros: Numero[];
    if (voie) {
      numeros = await VoiesService.findVoieNumeros(voie.id);
    } else if (toponyme) {
      numeros = await ToponymesService.findToponymeNumeros(toponyme.id);
    }

    if (numeros) {
      setNumeros(numeros);
    }
  }, [voie, toponyme]);

  const reloadBaseLocale = useCallback(async () => {
    const bal = await BasesLocalesService.findBaseLocale(baseLocale.id);
    setBaseLocale(bal);
    return bal;
  }, [baseLocale.id]);

  const refreshBALSync = useCallback(async () => {
    const { sync }: { sync: BaseLocaleSync } = baseLocale;
    if (
      sync &&
      sync.status === BaseLocaleSync.status.SYNCED &&
      !sync.isPaused &&
      !isRefrehSyncStat
    ) {
      setIsRefrehSyncStat(true);
      setTimeout(async () => {
        await reloadBaseLocale();
        setIsRefrehSyncStat(false);
        pushToast({
          title: "De nouvelles modifications ont été détectées",
          message:
            "Elles seront automatiquement transmises dans la Base Adresses Nationale d’ici quelques heures.",
          intent: "info",
          duration: 5000,
        });
      }, 30000); // Maximum interval between CRON job
    }
  }, [baseLocale, isRefrehSyncStat, reloadBaseLocale, pushToast]);

  const _reloadVoieAlerts = useCallback(
    async (voie: ExtendedVoieDTO) => {
      reloadVoieAlerts(
        voie,
        (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
      );
    },
    [baseLocale.settings?.ignoredAlertCodes, reloadVoieAlerts]
  );

  const _reloadVoiesAlerts = useCallback(
    async (overrideCodes?: AlertCodeEnum[]) => {
      const codes =
        overrideCodes ??
        (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) ??
        [];
      reloadVoiesAlerts(voies, codes);
    },
    [baseLocale.settings?.ignoredAlertCodes, reloadVoiesAlerts, voies]
  );

  const _reloadNumerosAlerts = useCallback(
    async (overrideCodes?: AlertCodeEnum[]) => {
      const codes =
        overrideCodes ??
        (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) ??
        [];
      reloadNumerosAlerts(baseLocale.id, codes);
    },
    [baseLocale.settings?.ignoredAlertCodes, reloadNumerosAlerts, baseLocale.id]
  );

  const setEditingId = useCallback(
    (editingId: string) => {
      if (token) {
        _setEditingId(editingId);
        setIsEditing(Boolean(editingId));
      }
    },
    [token]
  );

  const editingItem = useMemo(() => {
    if (editingId) {
      if (voie?.id === editingId) {
        return voie;
      }

      if (toponyme?.id === editingId) {
        return toponyme;
      }

      return union(voies, toponymes, numeros).find(
        ({ id }) => id === editingId
      );
    }
  }, [editingId, numeros, voie, toponyme, voies, toponymes]);

  useEffect(() => {
    reloadParcelles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function resumeBal() {
      await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      await reloadBaseLocale();
    }
    // SET RESUME BAL IF HABILITATION FRANCE_CONNECT
    if (
      searchParams.get(PRO_CONNECT_QUERY_PARAM) === "1" &&
      habilitation?.status === HabilitationDTO.status.ACCEPTED &&
      baseLocale.sync?.isPaused == true
    ) {
      resumeBal();
    }
  }, [
    baseLocale.id,
    baseLocale.sync?.isPaused,
    habilitation?.status,
    searchParams,
    reloadBaseLocale,
  ]);

  const value = useMemo(
    () => ({
      isEditing,
      setIsEditing,
      editingId,
      editingItem,
      baseLocale,
      habilitation,
      parcelles,
      voie,
      toponyme,
      numeros,
      voies: voies,
      toponymes: toponymes,
      isRefrehSyncStat,
      setEditingId,
      refreshBALSync,
      reloadHabilitation,
      reloadParcelles,
      reloadNumeros,
      reloadVoies,
      reloadToponymes,
      reloadBaseLocale,
      setVoie,
      setVoies,
      setToponyme,
      setNumeros,
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
      reloadVoieNumeros,
      commune,
      reloadVoieAlerts: _reloadVoieAlerts,
      reloadVoiesAlerts: _reloadVoiesAlerts,
      reloadNumerosAlerts: _reloadNumerosAlerts,
    }),
    [
      isEditing,
      editingId,
      setEditingId,
      editingItem,
      parcelles,
      reloadParcelles,
      baseLocale,
      reloadBaseLocale,
      habilitation,
      reloadHabilitation,
      voie,
      numeros,
      voies,
      toponymes,
      setVoies,
      reloadNumeros,
      reloadVoies,
      reloadToponymes,
      toponyme,
      isRefrehSyncStat,
      refreshBALSync,
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
      reloadVoieNumeros,
      commune,
      setNumeros,
      _reloadVoieAlerts,
      _reloadVoiesAlerts,
      _reloadNumerosAlerts,
    ]
  );

  return (
    <BalDataContext.Provider value={value}>
      {isBALDataLoaded ? (
        children
      ) : (
        <Pane
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          background="tint1"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
          <Paragraph marginTop={10}>
            Chargement de la base adresse locale...
          </Paragraph>
        </Pane>
      )}
    </BalDataContext.Provider>
  );
}

export const BalDataContextConsumer = BalDataContext.Consumer;

export default BalDataContext;
