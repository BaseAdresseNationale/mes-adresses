import {
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

export async function getExistingLocation(
  signalement: Signalement,
  voies: Voie[],
  toponymes: Toponyme[]
) {
  let existingLocation = null;
  if (signalement.existingLocation.type === ExistingLocation.type.VOIE) {
    existingLocation = voies.find((voie) => {
      if ((signalement.existingLocation as ExistingVoie).banId) {
        return (
          voie.banId === (signalement.existingLocation as ExistingVoie).banId
        );
      }

      return voie.nom === (signalement.existingLocation as ExistingVoie).nom;
    });
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.TOPONYME
  ) {
    existingLocation = toponymes.find((toponyme) => {
      if ((signalement.existingLocation as ExistingToponyme).banId) {
        return (
          toponyme.banId ===
          (signalement.existingLocation as ExistingToponyme).banId
        );
      }

      return (
        toponyme.nom === (signalement.existingLocation as ExistingToponyme).nom
      );
    });
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.NUMERO
  ) {
    const existingNumero = signalement.existingLocation as ExistingNumero;
    if (existingNumero.toponyme.type === ExistingLocation.type.VOIE) {
      const voie = voies.find((voie) => {
        if (existingNumero.toponyme.banId) {
          return voie.banId === existingNumero.toponyme.banId;
        }

        return voie.nom === existingNumero.toponyme.nom;
      });
      const numeros = await VoiesService.findVoieNumeros(voie.id);
      existingLocation = numeros.find(({ numero, suffixe, banId }) => {
        if (existingNumero.banId) {
          return banId === existingNumero.banId;
        }

        const existingLocationNumeroComplet = existingNumero.suffixe
          ? `${existingNumero.numero}${existingNumero.suffixe}`
          : `${existingNumero.numero}`;
        const numeroComplet = suffixe ? `${numero}${suffixe}` : `${numero}`;

        return numeroComplet === existingLocationNumeroComplet;
      });
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
      const toponyme = toponymes.find((toponyme) => {
        if (existingNumero.toponyme.banId) {
          return toponyme.banId === existingNumero.toponyme.banId;
        }

        return toponyme.nom === existingNumero.toponyme.nom;
      });
      const numeros = await ToponymesService.findToponymeNumeros(toponyme.id);
      existingLocation = numeros.find(({ numero, suffixe, banId }) => {
        if (existingNumero.banId) {
          return banId === existingNumero.banId;
        }

        const existingLocationNumeroComplet = existingNumero.suffixe
          ? `${existingNumero.numero}${existingNumero.suffixe}`
          : `${existingNumero.numero}`;
        const numeroComplet = suffixe ? `${numero}${suffixe}` : `${numero}`;
        return numeroComplet === existingLocationNumeroComplet;
      });
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
