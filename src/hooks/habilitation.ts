import {
  useState,
  useCallback,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi-api-bal";
import { PRO_CONNECT_QUERY_PARAM } from "@/lib/api-depot";
import { useSearchParams } from "next/navigation";

interface UseHabilitationType {
  habilitation: HabilitationDTO | null;
  reloadHabilitation: () => Promise<void>;
  isLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: Dispatch<SetStateAction<boolean>>;
}

export default function useHabilitation(
  baseLocale: ExtendedBaseLocaleDTO,
  token: string
): UseHabilitationType {
  const searchParams = useSearchParams();
  const [habilitation, setHabilitation] = useState<HabilitationDTO | null>(
    null
  );
  const [isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed] =
    useState<boolean>(searchParams.get(PRO_CONNECT_QUERY_PARAM) === "1");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation: HabilitationDTO =
          await HabilitationService.findHabilitation(baseLocale.id);
        setHabilitation(habilitation);
        // SET IF HABILITATION IS VALID
      } catch {
        setHabilitation(null);
      }
    }
  }, [baseLocale.id, token]);

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
    isLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  };
}
