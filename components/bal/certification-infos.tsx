import React from "react";
import { Pane, Alert, defaultTheme, Paragraph } from "evergreen-ui";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import Counter from "../counter";
import ProgressBar from "../progress-bar";

interface CertificationInfosProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function CertificationInfos({ baseLocale }: CertificationInfosProps) {
  const {
    nbNumeros,
    nbNumerosCertifies,
    isAllCertified: isCompleted,
  } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.floor((nbNumerosCertifies * 100) / nbNumeros) : 0;
  return (
    <Pane backgroundColor="white" padding={8}>
      <Alert
        intent="info"
        title="Certification"
        marginBottom={15}
        hasIcon={false}
      >
        <Pane width="100%">
          <ProgressBar percent={percentCertified} />
          <Pane display="flex" justifyContent="center">
            <Counter
              label="Adresses certifiées"
              value={nbNumerosCertifies}
              color={defaultTheme.colors.green500}
            />
            <Counter
              label="Adresses non-certifiées"
              value={nbNumeros - nbNumerosCertifies}
              color={defaultTheme.colors.gray500}
            />
          </Pane>
        </Pane>
        <Paragraph>
          Les adresses certifiées par la commune sont marquées comme fiables et
          prêtes à être utilisées par les réutilisateurs.
        </Paragraph>
      </Alert>
    </Pane>
  );
}

export default CertificationInfos;
