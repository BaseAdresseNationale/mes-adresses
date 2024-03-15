import { Signalement, SignalementTypeEnum } from "../api-signalement/types";

export const getExistingLocationLabel = (existingLocation) => {
  let label = "";
  switch (existingLocation.type) {
    case "NUMERO":
      label = `${existingLocation.numero} ${
        existingLocation.suffixe ? `${existingLocation.suffixe} ` : ""
      }${existingLocation.toponyme.nom}`;
      break;
    case "VOIE":
      label = "";
      break;
    case "TOPONYME":
      label = "";
      break;
    default:
      label = "";
  }

  return label;
};

const getRequestedLocationLabel = (changesRequested) => {
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
    case SignalementTypeEnum.LOCATION_TO_UPDATE:
      label = `Demande de modification : ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : `- ${new Date(signalement._created).toLocaleDateString()}`
      }`;
      break;
    case SignalementTypeEnum.LOCATION_TO_CREATE:
      label = `Demande de creation : ${getRequestedLocationLabel(
        signalement.changesRequested
      )}${
        opts?.withoutDate
          ? ""
          : `- ${new Date(signalement._created).toLocaleDateString()}`
      }`;
      break;
    case SignalementTypeEnum.LOCATION_TO_DELETE:
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
