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

import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";

interface CertificationInfosProps {
  openRecoveryDialog?: () => void;
}

function CertificationInfos({ openRecoveryDialog }: CertificationInfosProps) {
  const {
    certifyAllNumeros,
    uncertifyAllNumeros,
    baseLocale,
    reloadBaseLocale,
  } = useContext(BalDataContext);
  const [isDialogCertifieShown, setIsDialogCertifieShown] = useState(false);
  const [isDialogUncertifieShown, setIsDialogUncertifieShown] = useState(false);
  const [isInfosShown, setIsInfosShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { nbNumeros, nbNumerosCertifies } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.round((nbNumerosCertifies * 100) / nbNumeros) : 0;

  // Reload base local when the tab is mounted to be sure to have the updated number
  // of certified adresses
  useEffect(() => {
    reloadBaseLocale();
  }, [reloadBaseLocale]);

  const handleCertification = async () => {
    setIsDialogCertifieShown(false);
    setIsInfosShown(false);
    setIsLoading(true);
    await certifyAllNumeros();
    setIsLoading(false);
  };

  const handleUncertification = async () => {
    setIsDialogUncertifieShown(false);
    setIsInfosShown(false);
    setIsLoading(true);
    await uncertifyAllNumeros();
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsDialogUncertifieShown(false);
    setIsDialogCertifieShown(false);
    setIsInfosShown(false);
  };

  return (
    <Pane backgroundColor="white" padding={8} borderRadius={10} margin={8}>
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
        <Dialog
          isShown={isDialogCertifieShown}
          title="Certification des adresses"
          onCloseComplete={handleClose}
          footer={
            <Pane>
              <Button onClick={handleClose}>Annuler</Button>
              <Button
                isLoading={isLoading}
                appearance="primary"
                iconAfter={EndorsedIcon}
                marginLeft={15}
                onClick={handleCertification}
              >
                Certifier
              </Button>
            </Pane>
          }
        >
          <Pane>
            <Pane display="flex" alignItems="center">
              <WarningSignIcon size={65} margin={20} color="warning" />
              <Text size={500}>
                Vous vous apprêtez à certifier{" "}
                <b>{nbNumeros - nbNumerosCertifies}</b> adresses de votre
                commune, <b> cette action ne peut pas être annulée</b>
              </Text>
            </Pane>
          </Pane>
        </Dialog>

        <Dialog
          isShown={isDialogUncertifieShown}
          title="Décertification des adresses"
          onCloseComplete={handleClose}
          footer={
            <Pane>
              <Button onClick={handleClose}>Annuler</Button>
              <Button
                isLoading={isLoading}
                appearance="primary"
                intent="danger"
                marginLeft={15}
                onClick={handleUncertification}
              >
                Décertifier
              </Button>
            </Pane>
          }
        >
          <Pane>
            <Pane display="flex" alignItems="center">
              <WarningSignIcon size={65} margin={20} color="warning" />
              <Text size={500}>
                Vous vous apprêtez à décertifier <b>{nbNumerosCertifies}</b>{" "}
                adresses de votre commune,{" "}
                <b> cette action ne peut pas être annulée</b>
              </Text>
            </Pane>
          </Pane>
        </Dialog>

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
            <Pane display="flex" justifyContent="end" paddingTop={15}>
              {baseLocale.nbNumerosCertifies > 0 && (
                <Button
                  isLoading={isLoading}
                  iconBefore={openRecoveryDialog && LockIcon}
                  intent="danger"
                  appearance="primary"
                  marginRight={5}
                  onClick={() => {
                    if (openRecoveryDialog) {
                      openRecoveryDialog();
                    } else {
                      setIsDialogUncertifieShown(true);
                    }
                  }}
                >
                  Décertifier mes adresses
                </Button>
              )}
              {!baseLocale.isAllCertified && (
                <Button
                  isLoading={isLoading}
                  iconBefore={openRecoveryDialog && LockIcon}
                  intent="infos"
                  appearance="primary"
                  onClick={() => {
                    if (openRecoveryDialog) {
                      openRecoveryDialog();
                    } else {
                      setIsDialogCertifieShown(true);
                    }
                  }}
                >
                  Certifier mes adresses
                </Button>
              )}
            </Pane>
          </Alert>
        </Pane>
      )}
    </Pane>
  );
}

export default CertificationInfos;
