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
  const { toponymes } = useContext(BalDataContext);

  const toponyme = useMemo(() => {
    return toponymes.find((t) => t.id === feature.properties?.id);
  }, [feature.properties?.id, toponymes]);

  return (
    <Pane display="flex" flexDirection="column">
      <Strong>{feature.properties.nom}</Strong>
      <Text marginBottom="10px">
        {commune.code} - {commune.nom}
      </Text>
      {toponyme.nbNumeros <= 0 ? (
        <Badge color="red">Aucun numero</Badge>
      ) : toponyme.isAllCertified ? (
        <Badge color="green">Tous les numeros certifiés</Badge>
      ) : (
        <Badge color="yellow">
          {toponyme.nbNumerosCertifies}/{toponyme.nbNumeros} certifié(s)
        </Badge>
      )}
    </Pane>
  );
}

export default PopupFeatureVoie;
