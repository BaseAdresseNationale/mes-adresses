import { useContext } from "react";
import { Pane, Heading, Alert, Button, Text } from "evergreen-ui";
import { format } from "date-fns";

import usePublishProcess from "@/hooks/publish-process";

import BalDataContext from "@/contexts/bal-data";
import HabilitationTag from "../habilitation-tag";
import { CommuneType } from "@/types/commune";

interface HabilitationInfosProps {
  commune: CommuneType;
}

function HabilitationInfos({ commune }: HabilitationInfosProps) {
  const { habilitation, isHabilitationValid } = useContext(BalDataContext);

  const { handleShowHabilitationProcess } = usePublishProcess(commune);

  return (
    <Pane backgroundColor="white" padding={8} borderRadius={10} margin={8}>
      <Heading marginBottom={15}>Habilitation</Heading>

      {!habilitation || !isHabilitationValid ? (
        <Alert
          hasIcon={false}
          title={
            <Pane display="flex" alignItems="center">
              <HabilitationTag
                communeName={commune.nom}
                isHabilitationValid={isHabilitationValid}
              />
              <span style={{ marginLeft: 5 }}>
                Cette Base Adresse Locale n&apos;est pas habilitée
              </span>
            </Pane>
          }
        >
          <Text
            marginTop={5}
            is="p"
          >{`Afin d'être synchronisée avec la Base d'Adresse Nationnale, cette Base Adresse Locale doit être habilitée par la commune de ${commune.nom}. Notez qu'une habilitation est valide pendant 1 an.`}</Text>
          <Button appearance="primary" onClick={handleShowHabilitationProcess}>
            Habiliter la Base Adresse Locale
          </Button>
        </Alert>
      ) : (
        <Alert
          hasIcon={false}
          intent="success"
          title={
            <Pane display="flex" alignItems="center">
              <HabilitationTag
                communeName={commune.nom}
                isHabilitationValid={isHabilitationValid}
              />
              <span style={{ marginLeft: 5 }}>
                Cette Base Adresse Locale est habilitée
              </span>
            </Pane>
          }
        >
          <Text marginTop={5} is="p">
            Toutes les modifications remonteront automatiquement dans la Base
            Adresse Nationale jusqu&apos;au{" "}
            <b>{format(new Date(habilitation.expiresAt), "dd/MM/yyyy")}</b>.
          </Text>
        </Alert>
      )}
    </Pane>
  );
}

export default HabilitationInfos;
