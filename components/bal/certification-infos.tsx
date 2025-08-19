import { useState, useContext, useEffect } from "react";
import {
  Pane,
  Heading,
  Button,
  Text,
  Alert,
  EndorsedIcon,
  LightbulbIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";

import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";

function CertificationInfos() {
  const { baseLocale, reloadBaseLocale } = useContext(BalDataContext);
  const [isInfosShown, setIsInfosShown] = useState(false);
  const { nbNumeros, nbNumerosCertifies } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.floor((nbNumerosCertifies * 100) / nbNumeros) : 0;

  // Reload base local when the tab is mounted to be sure to have the updated number
  // of certified adresses
  useEffect(() => {
    reloadBaseLocale();
  }, [reloadBaseLocale]);

  return (
    <Pane backgroundColor="white" padding={8}>
      {!baseLocale.isAllCertified ? (
        <Pane>
          <Heading>Nombre d’adresses certifiées</Heading>
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

      <Pane>
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
      </Pane>

      {isInfosShown && (
        <Pane paddingTop={15}>
          <Alert>
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
          </Alert>
        </Pane>
      )}
    </Pane>
  );
}

export default CertificationInfos;
