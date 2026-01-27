import { ExtendedBaseLocaleDTO, Numero } from "@/lib/openapi-api-bal";
import { AlertNumero } from "@/lib/alerts/alerts.types";
import { isAlertNumeroSuffixe } from "@/lib/alerts/utils/alerts-numeros.utils";
import NumeroSuffixeWarning from "./warnings/numero-suffixe-warning";

interface TableNumeroWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  alerts: AlertNumero[];
  numero?: Numero;
  onSelect: () => void;
}

function TableNumeroWarning({ alerts, onSelect }: TableNumeroWarningProps) {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
          <div key={`alert-${index}`}>
            {index > 0 && <hr />}
            {isAlertNumeroSuffixe(alert) ? (
              <NumeroSuffixeWarning onSelect={onSelect} />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default TableNumeroWarning;
