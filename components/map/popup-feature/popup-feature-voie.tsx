import { useMemo, useContext } from "react";
import { Pane, Badge, Text, Strong } from "evergreen-ui";
import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";

interface PopupFeatureNumeroProps {
  feature: {
    geometry: {
      coordinates: number[];
    };
    properties: {
      id: string;
      nom: string;
    };
  };
  commune: CommuneType;
}

function PopupFeatureVoie({ feature, commune }: PopupFeatureNumeroProps) {
  const { voies } = useContext(BalDataContext);

  const voie = useMemo(() => {
    return voies.find((v) => v._id === feature.properties?.id);
  }, [feature.properties?.id, voies]);

  return (
    <Pane display="flex" flexDirection="column">
      <Strong>{feature.properties.nom}</Strong>
      <Text marginBottom="10px">
        {commune.code} - {commune.nom}
      </Text>
      {voie.nbNumeros <= 0 ? (
        <Badge color="red">Aucun numero</Badge>
      ) : voie.isAllCertified ? (
        <Badge color="green">Tous les numeros certifiés</Badge>
      ) : (
        <Badge color="yellow">
          {voie.nbNumerosCertifies}/{voie.nbNumeros} certifié(s)
        </Badge>
      )}
    </Pane>
  );
}

export default PopupFeatureVoie;
