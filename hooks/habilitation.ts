import {
  useState,
  useCallback,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { useRouter } from "next/router";

import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi";

interface UseHabilitationType {
  habilitation: HabilitationDTO | null;
  reloadHabilitation: () => Promise<void>;
  isValid: boolean;
  isLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: Dispatch<SetStateAction<boolean>>;
}

export default function useHabilitation(
  baseLocale: ExtendedBaseLocaleDTO,
  token: string
): UseHabilitationType {
  const { query } = useRouter();
  const [habilitation, setHabilitation] = useState<HabilitationDTO | null>(
    null
  );
  const [isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed] =
    useState<boolean>(query["france-connect"] === "1");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation: HabilitationDTO =
          await HabilitationService.findHabilitation(baseLocale._id);
        setHabilitation(habilitation);
        // SET IF HABILITATION IS VALID
        if (habilitation) {
          const isAccepted = habilitation.status === "accepted";
          const isExpired = new Date(habilitation.expiresAt) < new Date();
          setIsValid(isAccepted && !isExpired);
        } else {
          setIsValid(false);
        }
      } catch {
        setHabilitation(null);
        setIsValid(false);
      }
    }
  }, [baseLocale._id, token]);

  useEffect(() => {
    async function handleReloadHabilitation() {
      setIsLoading(true);
      await reloadHabilitation();
      setIsLoading(false);
    }

    handleReloadHabilitation();
  }, [token, reloadHabilitation]);

  return {
    habilitation,
    reloadHabilitation,
    isValid,
    isLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  };
}
