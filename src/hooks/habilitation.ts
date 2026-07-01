import {
  useState,
  useRef,
  useCallback,
  useEffect,
  SetStateAction,
  Dispatch,
  useContext,
} from "react";
import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi-api-bal";
import { PRO_CONNECT_QUERY_PARAM } from "@/lib/api-depot";
import { useSearchParams } from "next/navigation";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

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
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation: HabilitationDTO =
          await HabilitationService.findHabilitation(baseLocale.id);
        if (searchParams.get(PRO_CONNECT_QUERY_PARAM) === "1") {
          if (
            habilitation &&
            habilitation.status === HabilitationDTO.status.ACCEPTED
          ) {
            matomoTrackEvent(
              MatomoEventCategory.HABILITATION,
              MatomoEventAction[MatomoEventCategory.HABILITATION]
                .SUCCESS_PROCONNECT
            );
          } else {
            matomoTrackEvent(
              MatomoEventCategory.HABILITATION,
              MatomoEventAction[MatomoEventCategory.HABILITATION]
                .ERROR_PROCONNECT
            );
          }
        }
        setHabilitation(habilitation);
        // SET IF HABILITATION IS VALID
      } catch {
        setHabilitation(null);
        if (searchParams.get(PRO_CONNECT_QUERY_PARAM) === "1") {
          matomoTrackEvent(
            MatomoEventCategory.HABILITATION,
            MatomoEventAction[MatomoEventCategory.HABILITATION].ERROR_PROCONNECT
          );
        }
      }
    }
  }, [baseLocale.id, token, matomoTrackEvent, searchParams]);

  const reloadHabilitationRef = useRef(reloadHabilitation);
  reloadHabilitationRef.current = reloadHabilitation;

  useEffect(() => {
    async function handleReloadHabilitation() {
      setIsLoading(true);
      await reloadHabilitationRef.current();
      setIsLoading(false);
    }

    handleReloadHabilitation();
  }, [token]);

  return {
    habilitation,
    reloadHabilitation,
    isLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  };
}
