import { CommuneType } from "@/types/commune";
import { CommuneService, ExtendedBaseLocaleDTO } from "./openapi-api-bal";
import { ApiGeoService } from "./geo-api";
import bbox from "@turf/bbox";

export async function getCommuneWithBBox(
  baseLocale: ExtendedBaseLocaleDTO
): Promise<CommuneType> {
  const commune: CommuneType = await CommuneService.findCommune(
    baseLocale.commune
  );
  const communeApiGeo = await ApiGeoService.getCommune(baseLocale.commune, {
    fields: "contour",
  });
  if (communeApiGeo.contour) {
    commune.bbox = bbox(communeApiGeo.contour);
  }

  return commune;
}
