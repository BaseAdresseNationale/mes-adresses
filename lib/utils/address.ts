import { computeCompletNumero } from "@/lib/utils/numero";
import { CommuneType } from "@/types/commune";

export const getAddressPreview = (
  numero: string | number,
  suffixe: string,
  commune?: CommuneType,
  toponyme?: string,
  voie?: string
) => {
  const completNumero = computeCompletNumero(numero, suffixe) || "";
  if (toponyme) {
    return `${completNumero} ${voie}, ${toponyme}${
      commune ? ` - ${commune.nom} (${commune.code})` : ""
    }`;
  }

  if (voie) {
    return `${completNumero} ${voie}${
      commune ? ` - ${commune.nom} (${commune.code})` : ""
    }`;
  }

  if (!voie && !toponyme) {
    return `${completNumero}${
      commune ? ` - ${commune.nom} (${commune.code})` : ""
    }`;
  }

  return `${completNumero} ${voie}${
    commune ? ` - ${commune.nom} (${commune.code})` : ""
  }`;
};
