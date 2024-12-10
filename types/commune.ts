import {
  CommuneApiGeoType,
  CommuneDelegueeApiGeoType,
} from "@/lib/geo-api/type";
import { CommuneExtraDTO } from "@/lib/openapi-api-bal";

export type CommuneType = CommuneExtraDTO &
  CommuneApiGeoType & {
    communesDeleguees?: CommuneDelegueeApiGeoType[];
  };
