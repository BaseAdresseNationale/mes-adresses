import { orderBy } from "lodash";

export function sortBalByUpdate(array) {
  return orderBy(array, ["_updated"], ["desc"]);
}

export function sortBalByName(array) {
  return orderBy(array, [(array) => array.nom.toLowerCase()]);
}
