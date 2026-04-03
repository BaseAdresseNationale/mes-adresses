import { ExtendedBaseLocaleDTO, Numero } from "@/lib/openapi-api-bal";
import { AlertNumero } from "@/lib/alerts/alerts.types";
import {
  isAlertNumeroParcelle,
  isAlertNumeroSuffixe,
} from "@/lib/alerts/utils/alerts-numero.utils";
import WarningNumero from "./alerts-warning/warning-numero";
import { Li, majorScale, Menu, Pane, Ul } from "evergreen-ui";

interface TableNumeroWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  alerts: AlertNumero[];
  numero?: Numero;
  onSelect: () => void;
}

function TableNumeroWarning({ alerts, onSelect }: TableNumeroWarningProps) {
  return (
    <Menu>
      <Ul listStyle="none" paddingRight={16}>
        {alerts.map((alert, index) => {
          return (
            <Li key={`alert-${index}`}>
              {index > 0 && (
                <Pane borderTop={true} marginRight={majorScale(2)} />
              )}
              {isAlertNumeroSuffixe(alert) ? (
                <WarningNumero
                  title="Le suffixe du numéro est incorrect"
                  goToFormNumero={onSelect}
                />
              ) : null}
              {isAlertNumeroParcelle(alert) ? (
                <WarningNumero
                  title="La parcelle n'existe pas dans le cadastre"
                  goToFormNumero={onSelect}
                />
              ) : null}
            </Li>
          );
        })}
      </Ul>
    </Menu>
  );
}

export default TableNumeroWarning;
