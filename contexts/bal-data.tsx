import React, {useState, useMemo, useCallback, useEffect, useContext} from 'react'
import {union} from 'lodash'
import {toaster} from 'evergreen-ui'

import {BaseLocale, HabilitationDTO, Numero, Toponyme, Voie, BasesLocalesService, VoiesService, ToponymesService, Sync, UpdateBatchNumeroDTO} from '@/lib/openapi'
import TokenContext from '@/contexts/token'
import useHabilitation from '@/hooks/habilitation'

interface BALDataContextType {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editingId: string | null;
  setEditingId: (isEditing: string | null) => void;
  editingItem: Voie | Toponyme | Numero;
  baseLocale: BaseLocale;
  reloadBaseLocale: () => void;
  habilitation: HabilitationDTO;
  reloadHabilitation: () => Promise<void>;
  isHabilitationValid: boolean;
  parcelles: Array<Toponyme | Numero>;
  reloadParcelles: () => Promise<void>;
  voie: Voie;
  setVoie: (voie: Voie) => void;
  toponyme: Toponyme;
  setToponyme: (Toponyme: Toponyme) => void;
  numeros: Numero[];
  reloadNumeros: () => Promise<void>;
  voies: Voie[];
  reloadVoies: () => Promise<void>;
  toponymes: Toponyme[];
  reloadToponymes: () => Promise<void>;
  isRefrehSyncStat: boolean;
  refreshBALSync: () => Promise<void>;
  certifyAllNumeros: () => Promise<void>;
  habilitationIsLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: (isHabilitationProcessDisplayed: boolean) => void;
}

const BalDataContext = React.createContext<BALDataContextType | null>(null)

interface BalDataContextProviderProps {
  initialBaseLocale: BaseLocale;
  initialVoie: Voie;
  initialToponyme: Toponyme;
  initialVoies: Voie[];
  initialToponymes: Toponyme[];
  initialNumeros: Numero[];
  children: React.ReactNode;
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
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editingId, _setEditingId] = useState<string>(null)
  const [parcelles, setParcelles] = useState<Array<Numero | Toponyme>>([])
  const [numeros, setNumeros] = useState<Numero[]>(initialNumeros)
  const [voies, setVoies] = useState<Voie[]>(initialVoies)
  const [toponymes, setToponymes] = useState<Toponyme[]>(initialToponymes)
  const [voie, setVoie] = useState<Voie>(initialVoie)
  const [toponyme, setToponyme] = useState<Toponyme>(initialToponyme)
  const [baseLocale, setBaseLocale] = useState<BaseLocale>(initialBaseLocale)
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState<boolean>(false)

  const {token} = useContext(TokenContext)

  const [habilitation, reloadHabilitation, isHabilitationValid, habilitationIsLoading, isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed] = useHabilitation(initialBaseLocale, token)

  const reloadParcelles = useCallback(async () => {
    const parcelles: Array<Toponyme | Numero> = await BasesLocalesService.findBaseLocaleParcelles(baseLocale._id as string)
    setParcelles(parcelles)
  }, [baseLocale._id])

  const reloadVoies = useCallback(async () => {
    const voies: Voie[] = await BasesLocalesService.findBaseLocaleVoies(baseLocale._id as string)
    setVoies(voies)
  }, [baseLocale._id])

  const reloadToponymes = useCallback(async () => {
    const toponymes: Toponyme[] = await BasesLocalesService.findBaseLocaleToponymes(baseLocale._id as string)
    setToponymes(toponymes)
  }, [baseLocale._id])

  const reloadNumeros = useCallback(async () => {
    let numeros: Numero[]
    if (voie) {
      numeros = await VoiesService.findVoieNumeros(voie._id as string)
    } else if (toponyme) {
      numeros = await ToponymesService.findToponymeNumeros(toponyme._id as string)
    }

    if (numeros) {
      setNumeros(numeros)
    }
  }, [voie, toponyme])

  const reloadBaseLocale = useCallback(async () => {
    const bal = await BasesLocalesService.findBaseLocale(baseLocale._id as string)
    setBaseLocale(bal)
  }, [baseLocale._id])

  const refreshBALSync = useCallback(async () => {
    const {sync}: {sync: Sync} = baseLocale
    if (isHabilitationValid && sync && sync.status === 'synced' && !sync.isPaused && !isRefrehSyncStat) {
      setIsRefrehSyncStat(true)
      setTimeout(async () => {
        await reloadBaseLocale()
        setIsRefrehSyncStat(false)
        toaster.notify('De nouvelles modifications ont été détectées', {
          description: 'Elles seront automatiquement transmises dans la Base Adresses Nationale d’ici quelques heures.',
          duration: 10
        })
      }, 30000) // Maximum interval between CRON job
    }
  }, [baseLocale, isHabilitationValid, isRefrehSyncStat, reloadBaseLocale])

  const setEditingId = useCallback((editingId: string) => {
    if (token) {
      _setEditingId(editingId)
      setIsEditing(Boolean(editingId))
    }
  }, [token])

  const editingItem = useMemo(() => {
    if (editingId) {
      if (voie?._id === editingId) {
        return voie
      }

      if (toponyme?._id === editingId) {
        return toponyme
      }

      return union(voies, toponymes, numeros).find(({_id}) => _id === editingId)
    }
  }, [editingId, numeros, voie, toponyme, voies, toponymes])

  const certifyAllNumeros = useCallback(async () => {
    const updateBatchNumeroDTO: UpdateBatchNumeroDTO = {
      numerosIds: [],
      changes: {
        certifie: true
      }
    }
    await BasesLocalesService.updateNumeros(baseLocale._id as string, updateBatchNumeroDTO)
    await reloadNumeros()
    await reloadVoies()
    await reloadToponymes()
    await reloadBaseLocale()

    await refreshBALSync()
  }, [baseLocale._id, reloadNumeros, reloadVoies, reloadToponymes, reloadBaseLocale, refreshBALSync])

  useEffect(() => {
    setVoie(initialVoie)
  }, [initialVoie])

  useEffect(() => {
    setToponyme(initialToponyme)
  }, [initialToponyme])

  useEffect(() => {
    setVoies(initialVoies)
  }, [initialVoie, initialVoies])

  useEffect(() => {
    if (initialToponymes) {
      setToponymes(initialToponymes)
    }
  }, [initialToponymes])

  useEffect(() => {
    setNumeros(initialNumeros)
  }, [initialNumeros])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reloadParcelles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({
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
    setIsHabilitationProcessDisplayed
  }), [
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
    setIsHabilitationProcessDisplayed
  ])

  return <BalDataContext.Provider value={value} {...props} />
}

export const BalDataContextConsumer = BalDataContext.Consumer

export default BalDataContext
