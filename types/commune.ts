import { CommuneDTO } from "@/lib/openapi-api-bal";

export type CommuneType = CommuneDTO & {
  bbox?: number[];
};
