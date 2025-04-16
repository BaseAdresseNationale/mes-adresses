import { CommuneDTO } from "@/lib/openapi-api-bal";

export type CommuneType = CommuneDTO & {
  contour: { type: "Polygon"; coordinates: number[][][] };
};
