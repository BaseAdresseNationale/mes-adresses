import { useContext, useMemo } from "react";
import { Pane, Text } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";

import { Numero } from "@/lib/openapi-api-bal";

interface NumeroHeadingProps {
  numero: Numero;
}

function NumeroHeading({ numero }: NumeroHeadingProps) {
  const { toponymes } = useContext(BalDataContext);

  const infoSup = useMemo(() => {
    let res = "";

    if (numero.toponymeId) {
      const toponyme = toponymes.find(({ id }) => id === numero.toponymeId);
      if (toponyme.nom) {
        res += `- ${toponyme.nom}`;
      }
    }

    if (numero.communeDeleguee) {
      res += `- ${numero.communeDeleguee}`;
    }

    return res;
  }, [toponymes, numero.toponymeId, numero.communeDeleguee]);

  return (
    <Pane padding={1} fontSize={15}>
      <Text>
        {numero.numeroComplet}
        <i>{infoSup}</i>
      </Text>
    </Pane>
  );
}

export default NumeroHeading;
