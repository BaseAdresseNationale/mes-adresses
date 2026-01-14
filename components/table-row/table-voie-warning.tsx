import { ExtendedBaseLocaleDTO, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import { AlertCodeVoieEnum, AlertVoie } from "@/lib/alerts/alerts.types";
import VoieEmptyWarning from "./warnings/voie-empty-warning";
import VoieNomWarning from "./warnings/voie-nom-warning";
import { isAlertVoieNom } from "@/lib/alerts/utils/alerts-voies.utils";

interface TableVoieWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
  alerts: AlertVoie[];
}

function TableVoieWarning({ baseLocale, voie, alerts }: TableVoieWarningProps) {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
          <div key={`alert-${index}`}>
            {index > 0 && <hr />}
            {alert.codes.includes(AlertCodeVoieEnum.VOIE_EMPTY) ? (
              <VoieEmptyWarning baseLocale={baseLocale} voie={voie} />
            ) : isAlertVoieNom(alert) ? (
              <VoieNomWarning baseLocale={baseLocale} voie={voie} />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default TableVoieWarning;
