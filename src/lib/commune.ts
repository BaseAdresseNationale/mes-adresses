import { CommuneType } from "@/types/commune";
import {
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
} from "./openapi-api-bal";
import { ApiGeoService } from "./geo-api";
import bbox from "@turf/bbox";

export async function getCommuneWithBBox(
  baseLocale: ExtendedBaseLocaleDTO,
  voies: ExtendedVoieDTO[]
): Promise<CommuneType> {
  const commune: CommuneType = await CommuneService.findCommune(
    baseLocale.commune
  );
  try {
    const communeApiGeo = await ApiGeoService.getCommune(baseLocale.commune, {
      fields: "contour",
    });
    if (communeApiGeo.contour) {
      commune.bbox = bbox(communeApiGeo.contour);
      commune.contour = communeApiGeo.contour;
    }
  } catch (e) {
    if (voies.length > 0) {
      const bboxs = voies.map(({ bbox }) => bbox);
      commune.bbox = [
        Math.min(...bboxs.map((b) => b[0])),
        Math.min(...bboxs.map((b) => b[1])),
        Math.max(...bboxs.map((b) => b[2])),
        Math.max(...bboxs.map((b) => b[3])),
      ];
    }
  }

  return commune;
}
