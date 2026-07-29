import { orderBy } from "lodash";
import {
  BaseLocale,
  ExtendedBaseLocaleSafeDTO,
  ExtendedBaseLocaleDTO,
} from "../openapi-api-bal";

export function sortBalByUpdate<
  T extends
    | BaseLocale
    | ExtendedBaseLocaleDTO
    | (ExtendedBaseLocaleSafeDTO & { token: string }),
>(array: T[]): T[] {
  return orderBy(array, ["updatedAt"], ["desc"]);
}

export function sortBalByName(array: BaseLocale) {
  return orderBy(array, [(array) => array.nom.toLowerCase()]);
}
