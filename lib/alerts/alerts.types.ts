export enum AlertCodeEnum {
  CARACTERE_INVALIDE = "caractere_invalide",
  CARACTERE_INVALIDE_START = "caractere_invalide_start",
  CARACTERE_INVALIDE_END = "caractere_invalide_end",
  NO_WORDS_IN_PARENTHESES = "no_words_in_parentheses",
  MULTI_SPACE_CARACTERE = "multi_space_caractere",
  BAD_WORD_LIEUDIT = "bad_word_lieudit",
  BAD_MULTI_WORD_RUE = "bad_multi_word_rue",
  ABBREVIATION_INVALID = "abbreviation_invalid",
  CASSE_INCORRECTE = "casse_incorrecte",
  TOO_SHORT = "trop_court",
  TOO_LONG = "trop_long",
}

export const AlertDefinitions = {
  [AlertCodeEnum.CARACTERE_INVALIDE]: {
    message: "Le nom de la voie contient un caractère invalide",
  },
  [AlertCodeEnum.CARACTERE_INVALIDE_START]: {
    message: "Le nom de la voie commence par un caractère invalide",
  },
  [AlertCodeEnum.CARACTERE_INVALIDE_END]: {
    message: "Le nom de la voie finit par un caractère invalide",
  },
  [AlertCodeEnum.NO_WORDS_IN_PARENTHESES]: {
    message: "Le nom de la voie contient un mot entre parenthèses",
  },
  [AlertCodeEnum.MULTI_SPACE_CARACTERE]: {
    message: "Le nom de la voie contient plusieurs espaces de suite",
  },
  [AlertCodeEnum.BAD_WORD_LIEUDIT]: {
    message: "Le nom de la voie contient un mot de lieu-dit invalide",
  },
  [AlertCodeEnum.BAD_MULTI_WORD_RUE]: {
    message: "Le nom de la voie contient plusieurs fois le mot rue",
  },
  [AlertCodeEnum.ABBREVIATION_INVALID]: {
    message: "Le nom de la voie contient une abréviation invalide",
  },
  [AlertCodeEnum.CASSE_INCORRECTE]: {
    message: "Le nom de la voie contient une casse incorrecte",
  },
  [AlertCodeEnum.TOO_SHORT]: {
    message: "Le nom de la voie est trop court",
  },
  [AlertCodeEnum.TOO_LONG]: {
    message: "Le nom de la voie est trop long",
  },
};

export enum AlertFieldEnum {
  VOIE_NOM = "voie_nom",
}

export interface Alert {
  field: AlertFieldEnum;
  codes: AlertCodeEnum[];
  value: string;
  remediation?: string;
}

export interface AlertVoieNom extends Alert {
  field: AlertFieldEnum.VOIE_NOM;
}
