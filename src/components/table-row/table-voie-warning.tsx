import { ExtendedBaseLocaleDTO, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import {
  AlertCodeVoieEnum,
  AlertCodeNumeroEnum,
  AlertModelEnum,
  Alert,
} from "@/lib/alerts/alerts.types";
import WarningLink from "./alerts-warning/warning-link";
import { TabsEnum } from "../sidebar/main-tabs/main-tabs";
import WarningVoieEmpty from "./alerts-warning/warning-voie-empty";
import { Li, majorScale, Menu, Pane, Ul } from "evergreen-ui";

interface TableVoieWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
  alerts: Alert[];
}

function TableVoieWarning({ baseLocale, voie, alerts }: TableVoieWarningProps) {
  return (
    <Menu>
      <Ul listStyle="none" paddingRight={16}>
        {alerts.map((alert, index) => {
          return (
            <Li key={`alert-${index}`}>
              {index > 0 && (
                <Pane borderTop={true} marginRight={majorScale(2)} />
              )}
              {alert.model === AlertModelEnum.VOIE ? (
                <>
                  {!alert.codes.includes(AlertCodeVoieEnum.VOIE_EMPTY) ? (
                    <WarningLink
                      title="Suggestion sur le nom de la voie"
                      url={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}`}
                    />
                  ) : null}
                  {alert.codes.includes(AlertCodeVoieEnum.VOIE_EMPTY) ? (
                    <WarningVoieEmpty baseLocale={baseLocale} voie={voie} />
                  ) : null}
                </>
              ) : alert.model === AlertModelEnum.NUMERO ? (
                <>
                  {alert.codes.includes(
                    AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE
                  ) ? (
                    <WarningLink
                      title="Suggestion sur les numéros de la voie"
                      url={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}/numeros`}
                    />
                  ) : null}
                </>
              ) : null}
            </Li>
          );
        })}
      </Ul>
    </Menu>
  );
}

export default TableVoieWarning;
