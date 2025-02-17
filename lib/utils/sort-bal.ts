import { orderBy } from "lodash";
import { BaseLocale, ExtendedBaseLocaleDTO } from "../openapi-api-bal";

export function sortBalByUpdate(array: Array<BaseLocale | ExtendedBaseLocaleDTO>) {
  return orderBy(array, ["updatedAt"], ["desc"]);
}

export function sortBalByName(array: BaseLocale) {
  return orderBy(array, [(array) => array.nom.toLowerCase()]);
}
