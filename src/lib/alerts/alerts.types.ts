// MODEL
export enum AlertModelEnum {
  VOIE = "voie",
  NUMERO = "numero",
}

// CODE
export enum AlertCodeVoieEnum {
  CARACTERE_INVALIDE = "caractere_invalide",
  CARACTERE_INVALIDE_START_OR_END = "caractere_invalide_start_or_end",
  CARACTERE_INVALIDE_END = "caractere_invalide_end",
  NO_WORDS_IN_PARENTHESES = "no_words_in_parentheses",
  MULTI_SPACE_CARACTERE = "multi_space_caractere",
  BAD_WORD_LIEUDIT = "bad_word_lieudit",
  BAD_MULTI_WORD_RUE = "bad_multi_word_rue",
  ABBREVIATION_INVALID = "abbreviation_invalid",
  CASSE_INCORRECTE = "casse_incorrecte",
  VOIE_EMPTY = "voie_empty",
}

export enum AlertCodeNumeroEnum {
  SUFFIXE_CARACTERE_INVALIDE = "suffixe_caractere_invalide",
}

export type AlertCodeEnum = AlertCodeVoieEnum | AlertCodeNumeroEnum;

export type AlertCodeByModel<T extends AlertModelEnum> =
  T extends AlertModelEnum.VOIE
    ? AlertCodeVoieEnum
    : T extends AlertModelEnum.NUMERO
      ? AlertCodeNumeroEnum
      : never;

// FIELD
export enum AlertFieldVoieEnum {
  VOIE_NOM = "voie_nom",
}

export enum AlertFieldNumeroEnum {
  NUMERO_SUFFIXE = "numero_suffixe",
}

export type AlertFieldEnum = AlertFieldVoieEnum | AlertFieldNumeroEnum;

export type AlertFieldByModel<T extends AlertModelEnum> =
  T extends AlertModelEnum.VOIE
    ? AlertFieldVoieEnum
    : T extends AlertModelEnum.NUMERO
      ? AlertFieldNumeroEnum
      : never;

// ALERT
export type Alert<M extends AlertModelEnum = AlertModelEnum> = {
  model: M;
  codes: AlertCodeByModel<M>[];
  field: AlertFieldByModel<M>;
  value: string;
  remediation?: string;
} & (M extends AlertModelEnum.NUMERO ? { voieId?: string } : unknown);

export type AlertVoie = Alert<AlertModelEnum.VOIE>;
export type AlertNumero = Alert<AlertModelEnum.NUMERO>;

// FUNCTION
export function isAlertCodeVoieEnum(code: string): code is AlertCodeVoieEnum {
  return Object.values(AlertCodeVoieEnum).includes(code as AlertCodeVoieEnum);
}

export function isAlertCodeNumeroEnum(
  code: string
): code is AlertCodeNumeroEnum {
  return Object.values(AlertCodeNumeroEnum).includes(
    code as AlertCodeNumeroEnum
  );
}
