import { AlertCodeNumeroEnum, AlertCodeVoieEnum } from "./alerts.types";

export const AlertVoieDefinitions: Record<AlertCodeVoieEnum, string> = {
  [AlertCodeVoieEnum.CARACTERE_INVALIDE]:
    "Le nom de la voie semble contenir un caractère invalide",
  [AlertCodeVoieEnum.CARACTERE_INVALIDE_START_OR_END]:
    "Le nom de la voie semble commencer ou finir par un caractère invalide",
  [AlertCodeVoieEnum.CARACTERE_INVALIDE_END]:
    "Le nom de la voie semble finir par un caractère invalide",
  [AlertCodeVoieEnum.NO_WORDS_IN_PARENTHESES]:
    "Le nom de la voie semble contenir un mot entre parenthèses",
  [AlertCodeVoieEnum.MULTI_SPACE_CARACTERE]:
    "Le nom de la voie semble contenir plusieurs espaces de suite",
  [AlertCodeVoieEnum.BAD_WORD_LIEUDIT]:
    "Le nom de la voie semble contenir un mot de lieu-dit invalide",
  [AlertCodeVoieEnum.BAD_MULTI_WORD_RUE]:
    "Le nom de la voie semble contenir plusieurs fois le mot rue",
  [AlertCodeVoieEnum.ABBREVIATION_INVALID]:
    "Le nom de la voie semble contenir une abréviation invalide",
  [AlertCodeVoieEnum.CASSE_INCORRECTE]:
    "Le nom de la voie semble contenir une casse incorrecte",
  [AlertCodeVoieEnum.LAKE_OF_ACCENT]:
    "Le nom de la voie semble manquer d'un ou plusieurs accents",
  [AlertCodeVoieEnum.VOIE_EMPTY]:
    "La voie n'a pas de numéro, est-ce une voie sans adresse ?",
};

export const AlertNumeroDefinitions: Record<AlertCodeNumeroEnum, string> = {
  [AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE]:
    "Le suffixe du numéro semble contenir un caractère invalide",
  [AlertCodeNumeroEnum.PARCELLE_NOT_EXIST]:
    "La parcelle n'existe plus dans le cadastre de la commune",
};
