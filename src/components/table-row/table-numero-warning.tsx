import { ExtendedBaseLocaleDTO, Numero } from "@/lib/openapi-api-bal";
import { AlertNumero } from "@/lib/alerts/alerts.types";
import { isAlertNumeroSuffixe } from "@/lib/alerts/utils/alerts-numero.utils";
import WarningNumero from "./alerts-warning/warning-numero";

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
              <WarningNumero
                title="Le suffixe du numéro est incorrect"
                goToFormNumero={onSelect}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default TableNumeroWarning;
