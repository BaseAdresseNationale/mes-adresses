import { AlertCodeNumeroEnum } from "../../alerts.types";

export function computeNumeroSuffixeAlerts(
  value: string
): [codes: AlertCodeNumeroEnum[], remediation?: string] {
  const alphanumericRegex =
    /^[a-zA-ZàáâãäåæçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸ0-9\s]+$/u;
  if (value && !value.match(alphanumericRegex)) {
    return [
      [AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE],
      value.replace(
        /[^a-zA-ZàáâãäåæçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸ0-9\s]/gu,
        ""
      ),
    ];
  }

  return [[], null];
}
