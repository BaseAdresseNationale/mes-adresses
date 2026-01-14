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
      idVoie: string;
      idToponyme?: string;
      numero: number;
      certifie: boolean;
      parcelles: string;
      suffixe: string;
    };
  };
  commune: CommuneType;
}

function PopupFeatureNumero({ feature, commune }: PopupFeatureNumeroProps) {
  const { voies, toponymes } = useContext(BalDataContext);

  const getParcelles = useMemo(() => {
    return feature.properties?.parcelles
      ? JSON.parse(feature.properties?.parcelles)
      : [];
  }, [feature.properties]);

  const voie = useMemo(() => {
    return voies.find((v) => v.id === feature.properties?.idVoie);
  }, [feature.properties?.idVoie, voies]);

  const toponyme = useMemo(() => {
    return toponymes.find((t) => t.id === feature.properties?.idToponyme);
  }, [feature.properties?.idToponyme, toponymes]);

  return (
    <Pane display="flex" flexDirection="column">
      <Strong>
        {feature.properties.numero} {feature.properties.suffixe} {voie?.nom}
      </Strong>
      {toponyme && <Text is="i">{toponyme.nom}</Text>}
      <Text marginBottom="10px">
        {commune.code} - {commune.nom}
      </Text>
      {feature.properties.certifie ? (
        <Badge color="green">Certifié</Badge>
      ) : (
        <Badge color="yellow">Non certifié</Badge>
      )}
      {getParcelles.length > 0 && (
        <>
          <Strong marginTop="10px">Parcelle(s)</Strong>
          {getParcelles.map((parcelle) => (
            <Badge key={parcelle} color="blue" marginTop={4}>
              {parcelle}
            </Badge>
          ))}
        </>
      )}
    </Pane>
  );
}

export default PopupFeatureNumero;
