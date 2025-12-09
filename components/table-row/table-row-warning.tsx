import { ExtendedBaseLocaleDTO, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import {
  AlertCodeEnum,
  AlertVoie,
  isAlertVoieNom,
} from "@/lib/alerts/alerts.types";
import VoieEmptyWarning from "./warnings/voie-empty-warning";
import VoieNomWarning from "./warnings/voie-nom-warning";

interface TableRowWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
  alerts: AlertVoie[];
}

function TableRowWarning({ baseLocale, voie, alerts }: TableRowWarningProps) {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
          <div key={`alert-${index}`}>
            {index > 0 && <hr />}
            {alert.codes.includes(AlertCodeEnum.VOIE_EMPTY) ? (
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

export default TableRowWarning;
