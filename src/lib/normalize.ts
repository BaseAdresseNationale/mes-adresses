import { deburr } from "lodash";

export function normalizeSort(string) {
  return deburr(string.toLowerCase());
}
