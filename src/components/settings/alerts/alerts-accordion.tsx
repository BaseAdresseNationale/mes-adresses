import React, { useState } from "react";
import { Pane, Checkbox, Heading } from "evergreen-ui";
import { AccordionCard } from "../../accordion-card";
import {
  AlertCodeEnum,
  AlertCodeVoieEnum,
  AlertCodeNumeroEnum,
} from "@/lib/alerts/alerts.types";

import {
  AlertNumeroDefinitions,
  AlertVoieDefinitions,
} from "@/lib/alerts/alerts.definitions";

interface AlertsAccordionProps {
  ignoredAlertCodes: AlertCodeEnum[];
  setIgnoredAlertCodes: (ignoredAlertCodes: AlertCodeEnum[]) => void;
}

function AlertsAccordion({
  ignoredAlertCodes,
  setIgnoredAlertCodes,
}: AlertsAccordionProps) {
  const [isAccordionVoieActive, setIsAccordionVoieActive] = useState(false);
  const [isAccordionNumeroActive, setIsAccordionNumeroActive] = useState(false);

  const toggleAllAlertCodes = (
    alertsCodes: AlertCodeVoieEnum[] | AlertCodeNumeroEnum[]
  ) => {
    const allActive = alertsCodes.every(
      (code) => !ignoredAlertCodes.includes(code as AlertCodeEnum)
    );

    if (allActive) {
      setIgnoredAlertCodes([
        ...ignoredAlertCodes,
        ...(alertsCodes as AlertCodeEnum[]),
      ]);
    } else {
      setIgnoredAlertCodes(
        ignoredAlertCodes.filter(
          (code) => !(alertsCodes as string[]).includes(code)
        )
      );
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
      {/* VOIE */}
      <AccordionCard
        title={
          <Pane paddingLeft={8}>
            <Checkbox
              margin={0}
              label={<Heading size={400}>Alertes sur les voies</Heading>}
              checked={Object.entries(AlertVoieDefinitions).every(
                ([code]) => !ignoredAlertCodes.includes(code as AlertCodeEnum)
              )}
              onChange={() =>
                toggleAllAlertCodes(Object.values(AlertCodeVoieEnum))
              }
            />
          </Pane>
        }
        isActive={isAccordionVoieActive}
        onClick={() => setIsAccordionVoieActive(!isAccordionVoieActive)}
      >
        <Pane paddingLeft={8} paddingBottom={8}>
          {Object.entries(AlertVoieDefinitions).map(([code, value]) => (
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
      {/* NUMERO */}
      <AccordionCard
        title={
          <Pane paddingLeft={8}>
            <Checkbox
              margin={0}
              label={<Heading size={400}>Alertes sur les numéros</Heading>}
              checked={Object.entries(AlertNumeroDefinitions).every(
                ([code]) => !ignoredAlertCodes.includes(code as AlertCodeEnum)
              )}
              onChange={() =>
                toggleAllAlertCodes(Object.values(AlertCodeNumeroEnum))
              }
            />
          </Pane>
        }
        isActive={isAccordionNumeroActive}
        onClick={() => setIsAccordionNumeroActive(!isAccordionNumeroActive)}
      >
        <Pane paddingLeft={8} paddingBottom={8}>
          {Object.entries(AlertNumeroDefinitions).map(([code, value]) => (
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
