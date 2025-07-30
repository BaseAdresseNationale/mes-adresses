import {
  BaseLocale,
  Numero,
  Toponyme,
  ToponymesService,
  Voie,
  VoiesService,
} from "../openapi-api-bal";
import {
  ExistingLocation,
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  NumeroChangesRequestedDTO,
  Signalement,
  SignalementsService,
} from "../openapi-signalement";

export enum SignalementDiff {
  NEW = "new",
  DELETED = "deleted",
  UNCHANGED = "unchanged",
}

export enum ActiveCardEnum {
  INITIAL = "initial",
  CHANGES = "changes",
  FINAL = "final",
}

export const getExistingLocationLabel = (
  existingLocation: ExistingNumero | ExistingToponyme | ExistingVoie
) => {
  let label = "";
  switch (existingLocation.type) {
    case ExistingLocation.type.NUMERO:
      const existingNumero = existingLocation as ExistingNumero;
      label = `${existingNumero.numero} ${
        existingNumero.suffixe ? `${existingNumero.suffixe} ` : ""
      }${existingNumero.toponyme.nom}`;
      break;
    case "VOIE":
      const existingVoie = existingLocation as ExistingVoie;
      label = existingVoie.nom;
      break;
    case "TOPONYME":
      const existingToponyme = existingLocation as ExistingToponyme;
      label = existingToponyme.nom;
      break;
    default:
      label = "";
  }

  return label;
};

const getRequestedLocationLabel = (
  changesRequested: NumeroChangesRequestedDTO
) => {
  return `${changesRequested.numero} ${
    changesRequested.suffixe ? `${changesRequested.suffixe} ` : ""
  }${changesRequested.nomVoie}`;
};

export const getSignalementLabel = (
  signalement: Signalement,
  opts?: { withoutDate: boolean }
) => {
  let label = "";
  switch (signalement.type) {
    case Signalement.type.LOCATION_TO_CREATE:
      label = `${getRequestedLocationLabel(
        signalement.changesRequested as NumeroChangesRequestedDTO
      )}${
        opts?.withoutDate
          ? ""
          : ` - ${new Date(signalement.createdAt).toLocaleDateString()}`
      }`;
      break;
    default:
      label = `${getExistingLocationLabel(signalement.existingLocation)}${
        opts?.withoutDate
          ? ""
          : ` - ${new Date(signalement.createdAt).toLocaleDateString()}`
      }`;
  }

  return label;
};

const getExistingVoie = (
  signalementExistingVoie: ExistingVoie,
  voies: Voie[]
) => {
  return voies.find((voie) => {
    if (signalementExistingVoie.banId) {
      return (
        voie.banId === signalementExistingVoie.banId ||
        voie.nom?.toLowerCase() === signalementExistingVoie.nom?.toLowerCase()
      );
    }

    return (
      voie.nom?.toLowerCase() === signalementExistingVoie.nom?.toLowerCase()
    );
  });
};

const getExistingToponyme = (
  signalementExistingToponyme: ExistingToponyme,
  toponymes: Toponyme[]
) => {
  return toponymes.find((toponyme) => {
    if (signalementExistingToponyme.banId) {
      return (
        toponyme.banId === signalementExistingToponyme.banId ||
        toponyme.nom?.toLowerCase() ===
          signalementExistingToponyme.nom?.toLowerCase()
      );
    }

    return (
      toponyme.nom?.toLowerCase() ===
      signalementExistingToponyme.nom?.toLowerCase()
    );
  });
};

const getExistingNumero = (
  signalementExistingNumero: ExistingNumero,
  numeros: Numero[]
) => {
  return numeros.find(({ numero, suffixe, banId }) => {
    const existingLocationNumeroComplet = signalementExistingNumero.suffixe
      ? `${signalementExistingNumero.numero}${signalementExistingNumero.suffixe}`
      : `${signalementExistingNumero.numero}`;

    const numeroComplet = suffixe ? `${numero}${suffixe}` : `${numero}`;

    if (signalementExistingNumero.banId) {
      return (
        banId === signalementExistingNumero.banId ||
        numeroComplet?.toLowerCase() ===
          existingLocationNumeroComplet?.toLowerCase()
      );
    }

    return (
      numeroComplet?.toLowerCase() ===
      existingLocationNumeroComplet?.toLowerCase()
    );
  });
};

export async function getExistingLocation(
  signalement: Signalement,
  voies: Voie[],
  toponymes: Toponyme[]
) {
  let existingLocation = null;
  if (signalement.existingLocation.type === ExistingLocation.type.VOIE) {
    existingLocation = getExistingVoie(
      signalement.existingLocation as ExistingVoie,
      voies
    );
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.TOPONYME
  ) {
    existingLocation = getExistingToponyme(
      signalement.existingLocation as ExistingToponyme,
      toponymes
    );
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.NUMERO
  ) {
    const existingNumero = signalement.existingLocation as ExistingNumero;
    if (existingNumero.toponyme.type === ExistingLocation.type.VOIE) {
      const voie = getExistingVoie(
        existingNumero.toponyme as ExistingVoie,
        voies
      );
      const numeros = await VoiesService.findVoieNumeros(voie.id);
      existingLocation = getExistingNumero(existingNumero, numeros);
      if (existingLocation) {
        existingLocation.voie = voie;
        if ((existingLocation as Numero).toponymeId) {
          const toponyme = toponymes.find(
            (toponyme) =>
              toponyme.id === (existingLocation as Numero).toponymeId
          );
          (existingLocation as Numero).toponyme = toponyme;
        }
      }
    } else {
      const toponyme = getExistingToponyme(
        existingNumero.toponyme as ExistingToponyme,
        toponymes
      );
      const numeros = await ToponymesService.findToponymeNumeros(toponyme.id);
      existingLocation = getExistingNumero(existingNumero, numeros);
      if (existingLocation) {
        existingLocation.toponyme = toponyme;
        if ((existingLocation as Numero).voieId) {
          const voie = voies.find(
            (voie) => voie.id === (existingLocation as Numero).voieId
          );
          (existingLocation as Numero).voie = voie;
        }
      }
    }
  }

  return existingLocation;
}

export const detectChanges = (
  signalement: Signalement,
  existingLocation: Numero
) => {
  const { numero, suffixe, positions, parcelles, nomVoie, nomComplement } =
    signalement.changesRequested as NumeroChangesRequestedDTO;

  const numeroComplet = `${numero}${suffixe ? suffixe : ""}`;

  const {
    numeroComplet: existingNumeroComplet,
    positions: existingPositions,
    parcelles: existingParcelles,
    voie: existingVoie,
    toponyme: existingToponyme,
  } = existingLocation;

  return {
    voie: nomVoie !== existingVoie?.nom,
    numero: numeroComplet !== existingNumeroComplet,
    positions:
      JSON.stringify(positions.map(({ point, type }) => ({ point, type }))) !==
      JSON.stringify(
        existingPositions.map(({ point, type }) => ({ point, type }))
      ),
    parcelles: JSON.stringify(parcelles) !== JSON.stringify(existingParcelles),
    complement: nomComplement && nomComplement !== existingToponyme?.nom,
  };
};

export const canFetchSignalements = (baseLocale: BaseLocale, token: string) => {
  return (
    baseLocale.status === BaseLocale.status.PUBLISHED &&
    Boolean(token) &&
    process.env.NEXT_PUBLIC_API_SIGNALEMENT !== undefined
  );
};

export async function getAllSignalements(
  status?: Signalement.status[],
  types?: Signalement.type[],
  sourceIds?: string[],
  codeCommunes?: string[]
) {
  let page = 1;
  let response;
  const signalement = [];

  do {
    response = await SignalementsService.getSignalements(
      100,
      page,
      status,
      types,
      sourceIds,
      codeCommunes
    );
    signalement.push(...response.data);
    page++;
  } while (response.data.length > 0);

  return signalement;
}
