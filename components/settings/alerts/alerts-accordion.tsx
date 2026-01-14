import React, { useState } from "react";
import { Pane, Checkbox, Heading } from "evergreen-ui";
import { AccordionCard } from "../../accordion-card";
import {
  AlertCodeEnum,
  // AlertDefinitions,
  AlertModelEnum,
  AlertFieldEnum,
  AlertFieldVoieEnum,
  isAlertCodeVoieEnum,
  AlertFieldNumeroEnum,
  isAlertCodeNumeroEnum,
  AlertCodeVoieEnum,
} from "@/lib/alerts/alerts.types";

import { AlertVoieDefinitions } from "@/lib/alerts/alerts.definitions";

interface AlertsAccordionProps {
  ignoredAlertCodes: AlertCodeEnum[];
  setIgnoredAlertCodes: (ignoredAlertCodes: AlertCodeEnum[]) => void;
}

function AlertsAccordion({
  ignoredAlertCodes,
  setIgnoredAlertCodes,
}: AlertsAccordionProps) {
  const [isActive, setIsActive] = useState(false);

  const toggleAllAlertCodes = (f?: AlertFieldEnum) => {
    const allAlertCodesIgnored = Object.entries(AlertVoieDefinitions).filter(
      ([code]) => {
        if (f === AlertFieldVoieEnum.VOIE_NOM) {
          return isAlertCodeVoieEnum(code);
        } else if (f === AlertFieldNumeroEnum.NUMERO_SUFFIXE) {
          return isAlertCodeNumeroEnum(code);
        }
        return true;
      }
    );

    if (
      allAlertCodesIgnored.every(
        ([code]) => !ignoredAlertCodes.includes(code as AlertCodeEnum)
      )
    ) {
      setIgnoredAlertCodes(
        allAlertCodesIgnored.map(([code]) => code as AlertCodeEnum)
      );
    } else {
      setIgnoredAlertCodes([]);
    }
  };

  const toggleAlertCode = (code: AlertCodeEnum) => {
    if (ignoredAlertCodes.includes(code)) {
      setIgnoredAlertCodes(ignoredAlertCodes.filter((c) => c !== code));
    } else {
      setIgnoredAlertCodes([...ignoredAlertCodes, code]);
    }
  };

  return (
    <Pane width="100%">
      <AccordionCard
        title={
          <Pane paddingLeft={8}>
            <Checkbox
              margin={0}
              label={<Heading size={400}>Alertes sur les voies</Heading>}
              checked={Object.entries(AlertVoieDefinitions)
                .filter(([key]) => isAlertCodeVoieEnum(key))
                .every(
                  ([code]) => !ignoredAlertCodes.includes(code as AlertCodeEnum)
                )}
              onChange={() => toggleAllAlertCodes(AlertFieldVoieEnum.VOIE_NOM)}
            />
          </Pane>
        }
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
      >
        <Pane paddingLeft={8} paddingBottom={8}>
          {Object.entries(AlertVoieDefinitions)
            .filter(([key]) => isAlertCodeVoieEnum(key))
            .map(([code, value]) => (
              <Checkbox
                key={code}
                marginTop={8}
                marginBottom={8}
                label={value}
                checked={!ignoredAlertCodes.includes(code as AlertCodeEnum)}
                onChange={(e) => toggleAlertCode(code as AlertCodeEnum)}
              />
            ))}
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default AlertsAccordion;
