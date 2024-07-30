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
} from "@/lib/openapi";
import TokenContext from "@/contexts/token";
import useHabilitation from "@/hooks/habilitation";
import { ChildrenProps } from "@/types/context";
import { useRouter } from "next/router";
import LayoutContext from "./layout";

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
  isHabilitationValid: boolean;
  parcelles: Array<string>;
  reloadParcelles: () => Promise<void>;
  voie: Voie;
  setVoie: (voie: Voie) => void;
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
  certifyAllNumeros: () => Promise<void>;
  uncertifyAllNumeros: () => Promise<void>;
  habilitationIsLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: (
    isHabilitationProcessDisplayed: boolean
  ) => void;
}

const BalDataContext = React.createContext<BALDataContextType | null>(null);

interface BalDataContextProviderProps extends ChildrenProps {
  initialBaseLocale: ExtendedBaseLocaleDTO;
  initialVoie: Voie;
  initialToponyme: Toponyme;
  initialVoies: ExtendedVoieDTO[];
  initialToponymes: ExtentedToponymeDTO[];
  initialNumeros: Numero[];
}

export function BalDataContextProvider({
  initialBaseLocale,
  initialVoie,
  initialToponyme,
  initialVoies,
  initialToponymes,
  initialNumeros,
  ...props
}: BalDataContextProviderProps) {
  const { query } = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, _setEditingId] = useState<string>(null);
  const [parcelles, setParcelles] = useState<Array<string>>([]);
  const [numeros, setNumeros] = useState<Array<Numero>>(initialNumeros);
  const [voies, setVoies] = useState<ExtendedVoieDTO[]>(initialVoies);
  const [toponymes, setToponymes] =
    useState<ExtentedToponymeDTO[]>(initialToponymes);
  const [voie, setVoie] = useState<Voie>(initialVoie);
  const [toponyme, setToponyme] = useState<Toponyme>(initialToponyme);
  const [baseLocale, setBaseLocale] =
    useState<ExtendedBaseLocaleDTO>(initialBaseLocale);
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState<boolean>(false);
  const { pushToast } = useContext(LayoutContext);

  const { token } = useContext(TokenContext);

  const {
    habilitation,
    reloadHabilitation,
    isValid: isHabilitationValid,
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
  }, [baseLocale.id]);

  const reloadToponymes = useCallback(async () => {
    const toponymes: ExtentedToponymeDTO[] =
      await BasesLocalesService.findBaseLocaleToponymes(baseLocale.id);
    setToponymes(toponymes);
  }, [baseLocale.id]);

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

  const certifyAllNumeros = useCallback(async () => {
    await BasesLocalesService.certifyAllNumeros(baseLocale.id);
    await reloadNumeros();
    await reloadVoies();
    await reloadToponymes();
    await reloadBaseLocale();

    await refreshBALSync();
  }, [
    baseLocale.id,
    reloadNumeros,
    reloadVoies,
    reloadToponymes,
    reloadBaseLocale,
    refreshBALSync,
  ]);

  const uncertifyAllNumeros = useCallback(async () => {
    await BasesLocalesService.uncertifyAllNumeros(baseLocale.id);
    await reloadNumeros();
    await reloadVoies();
    await reloadToponymes();
    await reloadBaseLocale();

    await refreshBALSync();
  }, [
    baseLocale.id,
    reloadNumeros,
    reloadVoies,
    reloadToponymes,
    reloadBaseLocale,
    refreshBALSync,
  ]);

  useEffect(() => {
    setVoie(initialVoie);
  }, [initialVoie]);

  useEffect(() => {
    setToponyme(initialToponyme);
  }, [initialToponyme]);

  useEffect(() => {
    setVoies(initialVoies);
  }, [initialVoie, initialVoies]);

  useEffect(() => {
    if (initialToponymes) {
      setToponymes(initialToponymes);
    }
  }, [initialToponymes]);

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
      query["france-connect"] === "1" &&
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
      isHabilitationValid,
      parcelles,
      voie: voie || initialVoie,
      toponyme: toponyme || initialToponyme,
      numeros: numeros || initialNumeros,
      voies: voies || initialVoies,
      toponymes: toponymes || initialToponymes,
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
      setToponyme,
      certifyAllNumeros,
      uncertifyAllNumeros,
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
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
      isHabilitationValid,
      reloadHabilitation,
      voie,
      numeros,
      initialVoie,
      initialToponyme,
      initialNumeros,
      initialVoies,
      initialToponymes,
      voies,
      toponymes,
      reloadNumeros,
      reloadVoies,
      reloadToponymes,
      toponyme,
      certifyAllNumeros,
      uncertifyAllNumeros,
      isRefrehSyncStat,
      refreshBALSync,
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
    ]
  );

  return <BalDataContext.Provider value={value} {...props} />;
}

export const BalDataContextConsumer = BalDataContext.Consumer;

export default BalDataContext;
