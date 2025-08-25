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
  ToponymeChangesRequestedDTO,
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
  changesRequested: ToponymeChangesRequestedDTO | NumeroChangesRequestedDTO
) => {
  return isToponymeChangesRequested(changesRequested)
    ? changesRequested.nom
    : `${changesRequested.numero} ${
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

export const matchExistingToponyme = (
  signalementToponyme: { nom: string; banId?: string },
  toponymes: Array<Voie | Toponyme>
) => {
  return toponymes.find(({ nom, banId }) => {
    if (signalementToponyme.banId) {
      return (
        banId === signalementToponyme.banId ||
        nom.toLowerCase() === signalementToponyme.nom?.toLowerCase()
      );
    }

    return nom.toLowerCase() === signalementToponyme.nom?.toLowerCase();
  });
};

const matchExistingNumero = (
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

export function getAlreadyExistingLocation(
  signalement: Signalement,
  voies: Voie[]
) {
  return matchExistingToponyme(
    {
      nom: (signalement.changesRequested as NumeroChangesRequestedDTO).nomVoie,
    },
    voies
  );
}

export async function getExistingLocation(
  signalement: Signalement,
  voies: Voie[],
  toponymes: Toponyme[]
) {
  let existingLocation = null;
  if (signalement.existingLocation.type === ExistingLocation.type.VOIE) {
    existingLocation = matchExistingToponyme(
      signalement.existingLocation as ExistingVoie,
      voies
    );
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.TOPONYME
  ) {
    existingLocation = matchExistingToponyme(
      signalement.existingLocation as ExistingToponyme,
      toponymes
    );
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.NUMERO
  ) {
    const existingNumero = signalement.existingLocation as ExistingNumero;
    if (existingNumero.toponyme.type === ExistingLocation.type.VOIE) {
      const voie = matchExistingToponyme(
        existingNumero.toponyme as ExistingVoie,
        voies
      );
      const numeros = await VoiesService.findVoieNumeros(voie.id);
      existingLocation = matchExistingNumero(existingNumero, numeros);
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
      const toponyme = matchExistingToponyme(
        existingNumero.toponyme as ExistingToponyme,
        toponymes
      );
      const numeros = await ToponymesService.findToponymeNumeros(toponyme.id);
      existingLocation = matchExistingNumero(existingNumero, numeros);
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

export const isToponymeChangesRequested = (
  changesRequested: unknown
): changesRequested is ToponymeChangesRequestedDTO => {
  const { nom, parcelles, positions } =
    changesRequested as ToponymeChangesRequestedDTO;

  return nom && Array.isArray(parcelles) && Array.isArray(positions);
};

export const isNumeroChangesRequested = (
  changesRequested: unknown
): changesRequested is NumeroChangesRequestedDTO => {
  const { numero, parcelles, positions, nomVoie } =
    changesRequested as NumeroChangesRequestedDTO;

  return (
    numero && nomVoie && Array.isArray(parcelles) && Array.isArray(positions)
  );
};
