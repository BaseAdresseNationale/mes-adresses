import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { union } from "lodash";
import { toaster } from "evergreen-ui";

import {
  HabilitationDTO,
  Numero,
  Toponyme,
  Voie,
  BasesLocalesService,
  VoiesService,
  ToponymesService,
  Sync,
  NumeroPopulate,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  ExtendedVoieDTO,
} from "@/lib/openapi";
import TokenContext from "@/contexts/token";
import useHabilitation from "@/hooks/habilitation";
import { ChildrenProps } from "@/types/context";

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
  numeros: Array<Numero | NumeroPopulate>;
  reloadNumeros: () => Promise<void>;
  voies: ExtendedVoieDTO[];
  reloadVoies: () => Promise<void>;
  toponymes: ExtentedToponymeDTO[];
  reloadToponymes: () => Promise<void>;
  isRefrehSyncStat: boolean;
  refreshBALSync: () => Promise<void>;
  certifyAllNumeros: () => Promise<void>;
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, _setEditingId] = useState<string>(null);
  const [parcelles, setParcelles] = useState<Array<string>>([]);
  const [numeros, setNumeros] =
    useState<Array<Numero | NumeroPopulate>>(initialNumeros);
  const [voies, setVoies] = useState<ExtendedVoieDTO[]>(initialVoies);
  const [toponymes, setToponymes] =
    useState<ExtentedToponymeDTO[]>(initialToponymes);
  const [voie, setVoie] = useState<Voie>(initialVoie);
  const [toponyme, setToponyme] = useState<Toponyme>(initialToponyme);
  const [baseLocale, setBaseLocale] =
    useState<ExtendedBaseLocaleDTO>(initialBaseLocale);
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState<boolean>(false);

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
      await BasesLocalesService.findBaseLocaleParcelles(baseLocale._id);
    setParcelles(parcelles);
  }, [baseLocale._id]);

  const reloadVoies = useCallback(async () => {
    const voies: ExtendedVoieDTO[] =
      await BasesLocalesService.findBaseLocaleVoies(baseLocale._id);
    setVoies(voies);
  }, [baseLocale._id]);

  const reloadToponymes = useCallback(async () => {
    const toponymes: ExtentedToponymeDTO[] =
      await BasesLocalesService.findBaseLocaleToponymes(baseLocale._id);
    setToponymes(toponymes);
  }, [baseLocale._id]);

  const reloadNumeros = useCallback(async () => {
    let numeros: Numero[] | NumeroPopulate[];
    if (voie) {
      numeros = await VoiesService.findVoieNumeros(voie._id);
    } else if (toponyme) {
      numeros = await ToponymesService.findToponymeNumeros(toponyme._id);
    }

    if (numeros) {
      setNumeros(numeros);
    }
  }, [voie, toponyme]);

  const reloadBaseLocale = useCallback(async () => {
    const bal = await BasesLocalesService.findBaseLocale(baseLocale._id);
    setBaseLocale(bal);
  }, [baseLocale._id]);

  const refreshBALSync = useCallback(async () => {
    const { sync }: { sync: Sync } = baseLocale;
    if (
      sync &&
      sync.status === Sync.status.SYNCED &&
      !sync.isPaused &&
      !isRefrehSyncStat
    ) {
      setIsRefrehSyncStat(true);
      setTimeout(async () => {
        await reloadBaseLocale();
        setIsRefrehSyncStat(false);
        toaster.notify("De nouvelles modifications ont été détectées", {
          description:
            "Elles seront automatiquement transmises dans la Base Adresses Nationale d’ici quelques heures.",
          duration: 10,
        });
      }, 30000); // Maximum interval between CRON job
    }
  }, [baseLocale, isRefrehSyncStat, reloadBaseLocale]);

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
      if (voie?._id === editingId) {
        return voie;
      }

      if (toponyme?._id === editingId) {
        return toponyme;
      }

      return union(voies, toponymes, numeros).find(
        ({ _id }) => _id === editingId
      );
    }
  }, [editingId, numeros, voie, toponyme, voies, toponymes]);

  const certifyAllNumeros = useCallback(async () => {
    await BasesLocalesService.certifyAllNumeros(baseLocale._id);
    await reloadNumeros();
    await reloadVoies();
    await reloadToponymes();
    await reloadBaseLocale();

    await refreshBALSync();
  }, [
    baseLocale._id,
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
