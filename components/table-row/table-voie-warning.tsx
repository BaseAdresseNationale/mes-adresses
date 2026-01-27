import { ExtendedBaseLocaleDTO, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import {
  AlertCodeVoieEnum,
  AlertCodeNumeroEnum,
  AlertVoie,
  AlertNumero,
  AlertModelEnum,
} from "@/lib/alerts/alerts.types";
import VoieEmptyWarning from "./warnings/voie-empty-warning";
import VoieNomWarning from "./warnings/voie-nom-warning";
import { isAlertVoieNom } from "@/lib/alerts/utils/alerts-voies.utils";
import { Pane, Text, WarningSignIcon } from "evergreen-ui";
import VoieNumerosWarning from "./warnings/voie-numeros-warnings";

interface TableVoieWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
  alerts: (AlertVoie | AlertNumero)[];
}

function TableVoieWarning({ baseLocale, voie, alerts }: TableVoieWarningProps) {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
          <div key={`alert-${index}`}>
            {index > 0 && <hr />}
            {alert.model === AlertModelEnum.VOIE ? (
              <>
                {alert.codes.includes(AlertCodeVoieEnum.VOIE_EMPTY) && (
                  <VoieEmptyWarning baseLocale={baseLocale} voie={voie} />
                )}
                {!alert.codes.includes(AlertCodeVoieEnum.VOIE_EMPTY) && (
                  <VoieNomWarning baseLocale={baseLocale} voie={voie} />
                )}
              </>
            ) : alert.model === AlertModelEnum.NUMERO ? (
              <>
                {alert.codes.includes(
                  AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE,
                ) ? (
                  <VoieNumerosWarning baseLocale={baseLocale} voie={voie} />
                ) : null}
              </>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default TableVoieWarning;
