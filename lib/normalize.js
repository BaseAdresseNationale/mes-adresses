import {deburr} from 'lodash-es'

export function normalizeSort(string) {
  return deburr(string.toLowerCase())
}
