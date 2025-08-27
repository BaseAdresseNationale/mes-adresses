import { useState, useContext, useEffect } from "react";
import {
  Pane,
  Heading,
  Dialog,
  Button,
  Text,
  Alert,
  EndorsedIcon,
  WarningSignIcon,
  LightbulbIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  LockIcon,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import style from "./goal-card.module.css";
import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface CertificationGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function CertificationGoal({ baseLocale }: CertificationGoalProps) {
  const { nbNumeros, nbNumerosCertifies } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.floor((nbNumerosCertifies * 100) / nbNumeros) : 0;

  return (
    <Pane className={style["goal-card"]}>
      <Heading>📍 Certification</Heading>
      {!baseLocale.isAllCertified ? (
        <Pane>
          <ProgressBar percent={percentCertified} />
        </Pane>
      ) : (
        <Pane display="flex" alignItems="center" marginY="1em" marginX="4px">
          <EndorsedIcon color="success" size={50} />
          <Text size={500} paddingLeft={20}>
            Toutes les adresses sont certifiées par la commune
          </Text>
        </Pane>
      )}
      <Pane display="flex" justifyContent="center">
        <Counter
          label="Adresses certifiées"
          value={nbNumerosCertifies}
          color="#52BD95"
        />
        <Counter
          label="Adresses non-certifiées"
          value={nbNumeros - nbNumerosCertifies}
          color="#c1c4d6"
        />
      </Pane>

      {/* <Pane>
        <Pane textAlign="center">
          <Button
            iconBefore={LightbulbIcon}
            iconAfter={isInfosShown ? ChevronUpIcon : ChevronDownIcon}
            appearance="minimal"
            onClick={() => {
              setIsInfosShown(!isInfosShown);
            }}
          >
            En savoir plus sur la certification
          </Button>
        </Pane>
      </Pane> */}

      {/* {isInfosShown && ( */}
      {/* <Pane paddingTop={15}> */}
      {/* <Alert
        title="En savoir plus sur la certification"
        onClick={() => {
          setIsInfosShown(!isInfosShown);
        }}
        cursor="pointer"
      >
        {isInfosShown && (
          <Pane marginTop={16}>
            <Heading size={400}>
              Pour faciliter la réutilisation des adresses,{" "}
              <u>il est conseillé de les certifier</u>.
            </Heading>
            <br />
            <Text>
              Il est tout à fait possible de publier une Base Adresse Locale
              dont l’ensemble des{" "}
              <u>
                numéros n’ont pas encore été vérifiés : ils doivent rester
                non-certifiés.
              </u>
              <br />
            </Text>
            <Pane paddingTop={15}>
              <Text>
                En revanche, les numéros qui auront été authentifiés par la
                commune <u>devront être certifiés</u>, qu’ils soient
                nouvellement crées par la commune ou que leur correspondance
                avec la liste officielle qui ressort du Conseil municipal, soit
                avérée.
              </Text>
            </Pane>
            <Heading paddingY={15}>
              Toutes les adresses de votre commune ont été vérifiées ?
            </Heading>
            <Pane>
              <Text>
                Si vous avez déjà procédé à la vérification de toutes les
                adresses de votre commune, cliquez sur le bouton «certifier mes
                adresses».
              </Text>
            </Pane>
          </Pane>
        )}
      </Alert> */}
    </Pane>
  );
}

export default CertificationGoal;
