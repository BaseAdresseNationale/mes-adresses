import { Pane, Text } from "evergreen-ui";

import { computeCompletNumero } from "@/lib/utils/numero";
import { CommuneType } from "@/types/commune";

const getAddressPreview = (numero, suffixe, toponyme, voie, commune) => {
  const completNumero = computeCompletNumero(numero, suffixe);
  if (toponyme) {
    return `${completNumero} ${voie}, ${toponyme} - ${commune.nom} (${commune.code})`;
  }

  if (voie) {
    return `${completNumero} ${voie} - ${commune.nom} (${commune.code})`;
  }

  if (!voie && !toponyme) {
    return `${completNumero} - ${commune.nom} (${commune.code})`;
  }

  return `${completNumero} ${voie} - ${commune.nom} (${commune.code})`;
};

interface AddressPreviewProps {
  numero: string | number;
  suffixe?: string;
  selectedNomToponyme: string;
  voie: string;
  commune: CommuneType;
}

function AddressPreview({
  numero,
  suffixe,
  selectedNomToponyme,
  voie,
  commune,
}: AddressPreviewProps) {
  const address = getAddressPreview(
    numero,
    suffixe,
    selectedNomToponyme,
    voie,
    commune
  );

  return (
    <Pane
      position="fixed"
      width={500}
      transition="left 0.3s"
      boxSizing="border-box"
      left={0}
      zIndex={3}
      background="blue300"
      paddingY={8}
      paddingX={12}
      marginTop={-12}
    >
      <Text fontSize={address.length > 110 ? "12px" : "13px"} color="white">
        {address}
      </Text>
    </Pane>
  );
}

export default AddressPreview;
