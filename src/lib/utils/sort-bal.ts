import { orderBy } from "lodash";
import {
  BaseLocale,
  BaseLocaleWithHabilitationDTO,
  ExtendedBaseLocaleDTO,
} from "../openapi-api-bal";

export function sortBalByUpdate<
  T extends
    | BaseLocale
    | ExtendedBaseLocaleDTO
    | (BaseLocaleWithHabilitationDTO & { token: string }),
>(array: T[]): T[] {
  return orderBy(array, ["updatedAt"], ["desc"]);
}

export function sortBalByName(array: BaseLocale) {
  return orderBy(array, [(array) => array.nom.toLowerCase()]);
}
