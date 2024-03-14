import { Signalement } from "../api-signalement/types";

export const getExistingLocationLabel = (existingLocation) => {
  let label = "";
  switch (existingLocation.type) {
    case "NUMERO":
      label = `${existingLocation.numero} ${
        existingLocation.suffixe ? `${existingLocation.suffixe} ` : ""
      }${existingLocation.toponyme.nom}`;
      break;
    case "VOIE":
      label = "Demande de création";
      break;
    case "TOPONYME":
      label = "Demande de création";
      break;
    default:
      label = "";
  }

  return label;
};

export const getSignalementLabel = (
  signalement: Signalement,
  opts?: { withoutDate: boolean }
) => {
  let label = "";
  switch (signalement.type) {
    case "LOCATION_TO_UPDATE":
      label = `Demande de modification sur le ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : `- ${new Date(signalement._created).toLocaleDateString()}`
      }`;
      break;
    case "LOCATION_TO_CREATE":
      label = "Demande de création";
      break;
    default:
      label = "Autre demande";
  }

  return label;
};
