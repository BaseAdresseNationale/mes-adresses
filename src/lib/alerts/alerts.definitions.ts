import { AlertCodeNumeroEnum, AlertCodeVoieEnum } from "./alerts.types";

export const AlertVoieDefinitions: Record<AlertCodeVoieEnum, string> = {
  [AlertCodeVoieEnum.CARACTERE_INVALIDE]:
    "Le nom de la voie contient un caractère invalide",
  [AlertCodeVoieEnum.CARACTERE_INVALIDE_START_OR_END]:
    "Le nom de la voie commence ou finit par un caractère invalide",
  [AlertCodeVoieEnum.CARACTERE_INVALIDE_END]:
    "Le nom de la voie finit par un caractère invalide",
  [AlertCodeVoieEnum.NO_WORDS_IN_PARENTHESES]:
    "Le nom de la voie contient un mot entre parenthèses",
  [AlertCodeVoieEnum.MULTI_SPACE_CARACTERE]:
    "Le nom de la voie contient plusieurs espaces de suite",
  [AlertCodeVoieEnum.BAD_WORD_LIEUDIT]:
    "Le nom de la voie contient un mot de lieu-dit invalide",
  [AlertCodeVoieEnum.BAD_MULTI_WORD_RUE]:
    "Le nom de la voie contient plusieurs fois le mot rue",
  [AlertCodeVoieEnum.ABBREVIATION_INVALID]:
    "Le nom de la voie contient une abréviation invalide",
  [AlertCodeVoieEnum.CASSE_INCORRECTE]:
    "Le nom de la voie contient une casse incorrecte",
  [AlertCodeVoieEnum.VOIE_EMPTY]: "La voie n'a pas de numéro",
};

export const AlertNumeroDefinitions: Record<AlertCodeNumeroEnum, string> = {
  [AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE]:
    "Le suffixe du numéro contient un caractère invalide",
};
