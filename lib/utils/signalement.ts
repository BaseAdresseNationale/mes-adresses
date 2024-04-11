import {
  ChangesRequested,
  ExistingLocation,
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  Signalement,
} from "../openapi-signalement";

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

const getRequestedLocationLabel = (changesRequested: ChangesRequested) => {
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
    case Signalement.type.LOCATION_TO_UPDATE:
      label = `Demande de modification : ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : `- ${new Date(signalement._created).toLocaleDateString()}`
      }`;
      break;
    case Signalement.type.LOCATION_TO_CREATE:
      label = `Demande de creation : ${getRequestedLocationLabel(
        signalement.changesRequested
      )}${
        opts?.withoutDate
          ? ""
          : `- ${new Date(signalement._created).toLocaleDateString()}`
      }`;
      break;
    case Signalement.type.LOCATION_TO_DELETE:
      label = `Demande de suppression : ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : `- ${new Date(signalement._created).toLocaleDateString()}`
      }`;
      break;
    default:
      label = "Autre demande";
  }

  return label;
};
