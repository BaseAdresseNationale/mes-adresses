import { CommuneApiGeoType } from "@/lib/geo-api/type";
import { ApiGeoService } from "@/lib/geo-api";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import { canFetchSignalements } from "@/lib/utils/signalement";
import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
  OpenAPI,
} from "@/lib/openapi-api-bal";

export const fetchBALInfos = async (baseLocale: ExtendedBaseLocaleDTO) => {
  const fetchCommune = async () => {
    const commune: CommuneApiGeoType = await ApiGeoService.getCommune(
      baseLocale.commune
    );

    return commune;
  };

  const fetchCommuneFlag = async () => {
    const flagUrl = await getCommuneFlagProxy(baseLocale.commune);

    return flagUrl;
  };

  const fetchHabilitationIsValid = async () => {
    const isValid: boolean = await HabilitationService.findIsValid(
      baseLocale.id
    );

    return isValid;
  };

  const fetchHabilitation = async () => {
    try {
      Object.assign(OpenAPI, { TOKEN: baseLocale.token });
      const habilitation: HabilitationDTO =
        await HabilitationService.findHabilitation(baseLocale.id);
      Object.assign(OpenAPI, { TOKEN: null });

      const isAccepted = habilitation.status === "accepted";
      const isExpired = new Date(habilitation.expiresAt) < new Date();

      return {
        habilitation,
        isValid: isAccepted && !isExpired,
      };
    } catch {
      return {
        habilitation: null,
        isValid: false,
      };
    }
  };

  const fetchPendingSignalementsCount = async () => {
    const paginatedSignalements = await SignalementsService.getSignalements(
      1,
      undefined,
      [Signalement.status.PENDING],
      undefined,
      undefined,
      [baseLocale.commune]
    );

    return paginatedSignalements.total;
  };

  const commune = await fetchCommune();
  const flag = await fetchCommuneFlag();

  let habilitation: HabilitationDTO | null = null;
  let isHabilitationValid = false;
  let pendingSignalementsCount = 0;

  if (!baseLocale.token) {
    isHabilitationValid = await fetchHabilitationIsValid();
  } else {
    if (canFetchSignalements(baseLocale, baseLocale.token)) {
      pendingSignalementsCount = await fetchPendingSignalementsCount();
    }
    const result = await fetchHabilitation();
    habilitation = result.habilitation;
    isHabilitationValid = result.isValid;
  }

  return {
    commune,
    flag,
    habilitation,
    isHabilitationValid,
    pendingSignalementsCount,
    isLoaded: true,
  };
};
