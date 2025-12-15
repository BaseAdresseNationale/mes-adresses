import React, { useState } from "react";
import { Pane, Checkbox, Heading } from "evergreen-ui";
import { AccordionCard } from "../../accordion-card";
import {
  AlertCodeEnum,
  AlertDefinitions,
  AlertModelEnum,
  AlertFieldEnum,
} from "@/lib/alerts/alerts.types";

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
    const allAlertCodesIgnored = Object.entries(AlertDefinitions)
      .filter(([, { field }]) => field === f)
      .every(([code]) => !ignoredAlertCodes.includes(code as AlertCodeEnum));
    if (allAlertCodesIgnored) {
      setIgnoredAlertCodes(
        Object.entries(AlertDefinitions)
          .filter(([, { field }]) => field === f)
          .map(([code]) => code as AlertCodeEnum)
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
      {Object.entries(AlertDefinitions)
        .filter(
          ([, { model, field }]) => model === AlertModelEnum.VOIE && !field
        )
        .map(([code, { message }]) => (
          <Checkbox
            marginLeft={16}
            key={code}
            marginTop={8}
            marginBottom={8}
            label={message}
            checked={!ignoredAlertCodes.includes(code as AlertCodeEnum)}
            onChange={(e) => toggleAlertCode(code as AlertCodeEnum)}
          />
        ))}

      <AccordionCard
        title={
          <Pane paddingLeft={8}>
            <Checkbox
              margin={0}
              label={
                <Heading size={400}>Alertes sur les noms de voies</Heading>
              }
              checked={Object.entries(AlertDefinitions)
                .filter(([, { field }]) => field === AlertFieldEnum.VOIE_NOM)
                .every(
                  ([code]) => !ignoredAlertCodes.includes(code as AlertCodeEnum)
                )}
              onChange={() => toggleAllAlertCodes(AlertFieldEnum.VOIE_NOM)}
            />
          </Pane>
        }
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
      >
        <Pane paddingLeft={8} paddingBottom={8}>
          {Object.entries(AlertDefinitions)
            .filter(([, { field }]) => field === AlertFieldEnum.VOIE_NOM)
            .map(([code, { message }]) => (
              <Checkbox
                key={code}
                marginTop={8}
                marginBottom={8}
                label={message}
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
