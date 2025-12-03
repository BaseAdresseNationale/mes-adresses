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
import AlertsContext from "@/contexts/alerts";
import useHabilitation from "@/hooks/habilitation";
import { useRouter } from "next/router";
import LayoutContext from "./layout";
import { PRO_CONNECT_QUERY_PARAM } from "@/lib/api-depot";
import { CommuneType } from "@/types/commune";
import { getCommuneWithBBox } from "@/lib/commune";
import { Pane, Paragraph, Spinner } from "evergreen-ui";

interface BALDataContextType {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editingId: string | null;
  setEditingId: (isEditing: string | null) => void;
  editingItem: Voie | Toponyme | Numero;
  baseLocale: ExtendedBaseLocaleDTO;
  reloadBaseLocale: () => void;
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
  reloadVoies: () => Promise<void>;
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
}

const BalDataContext = React.createContext<BALDataContextType | null>(null);

interface BalDataContextProviderProps {
  initialBaseLocale: ExtendedBaseLocaleDTO;
  initialVoie: Voie;
  initialToponyme: Toponyme;
  initialNumeros: Numero[];
  children: React.ReactNode;
}

export function BalDataContextProvider({
  initialBaseLocale,
  initialVoie,
  initialToponyme,
  initialNumeros,
  children,
}: BalDataContextProviderProps) {
  const { query } = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, _setEditingId] = useState<string>(null);
  const [parcelles, setParcelles] = useState<Array<string>>([]);
  const [numeros, setNumeros] = useState<Array<Numero>>(initialNumeros);
  const [voies, setVoies] = useState<ExtendedVoieDTO[]>([]);
  const [toponymes, setToponymes] = useState<ExtentedToponymeDTO[]>([]);
  const [commune, setCommune] = useState<CommuneType | null>(null);
  const [voie, setVoie] = useState<Voie>(initialVoie);
  const [toponyme, setToponyme] = useState<Toponyme>(initialToponyme);
  const [baseLocale, setBaseLocale] =
    useState<ExtendedBaseLocaleDTO>(initialBaseLocale);
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState<boolean>(false);
  const { pushToast } = useContext(LayoutContext);
  const { token } = useContext(TokenContext);
  const { reloadVoiesAlerts } = useContext(AlertsContext);
  const [isBALDataLoaded, setIsBALDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchBALData() {
      try {
        reloadVoies();
        const toponymes = await BasesLocalesService.findBaseLocaleToponymes(
          initialBaseLocale.id
        );
        const commune = await getCommuneWithBBox(initialBaseLocale, voies);
        setToponymes(toponymes);
        setCommune(commune);
        setIsBALDataLoaded(true);
      } catch (error) {
        console.error("Error fetching BAL data:", error);
      }
    }

    if (!isBALDataLoaded) {
      fetchBALData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBaseLocale, isBALDataLoaded]);

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

  const reloadVoies = useCallback(async () => {
    const voies: ExtendedVoieDTO[] =
      await BasesLocalesService.findBaseLocaleVoies(baseLocale.id);
    setVoies(voies);
    reloadVoiesAlerts(voies);
  }, [baseLocale.id, reloadVoiesAlerts]);

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
    setVoie(initialVoie);
  }, [initialVoie]);

  useEffect(() => {
    setToponyme(initialToponyme);
  }, [initialToponyme]);

  useEffect(() => {
    setNumeros(initialNumeros);
  }, [initialNumeros]);

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
      query[PRO_CONNECT_QUERY_PARAM] === "1" &&
      habilitation?.status === HabilitationDTO.status.ACCEPTED &&
      baseLocale.sync?.isPaused == true
    ) {
      resumeBal();
    }
  }, [
    baseLocale.id,
    baseLocale.sync?.isPaused,
    habilitation?.status,
    query,
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
      voie: voie || initialVoie,
      toponyme: toponyme || initialToponyme,
      numeros: numeros || initialNumeros,
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
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
      reloadVoieNumeros,
      commune,
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
      initialVoie,
      initialToponyme,
      initialNumeros,
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
