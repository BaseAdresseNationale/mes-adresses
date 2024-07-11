import {
  DeleteNumeroChangesRequestedDTO,
  ExistingLocation,
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  NumeroChangesRequestedDTO,
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
    case Signalement.type.LOCATION_TO_UPDATE:
      label = `Demande de modification : ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : ` - ${new Date(signalement.createdAt).toLocaleDateString()}`
      }`;
      break;
    case Signalement.type.LOCATION_TO_CREATE:
      label = `Demande de creation : ${getRequestedLocationLabel(
        signalement.changesRequested as NumeroChangesRequestedDTO
      )}${
        opts?.withoutDate
          ? ""
          : ` - ${new Date(signalement.createdAt).toLocaleDateString()}`
      }`;
      break;
    case Signalement.type.LOCATION_TO_DELETE:
      label = `Demande de suppression : ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : ` - ${new Date(signalement.createdAt).toLocaleDateString()}`
      }`;
      break;
    default:
      label = `Autre demande : ${getExistingLocationLabel(
        signalement.existingLocation
      )}${
        opts?.withoutDate
          ? ""
          : ` - ${new Date(signalement.createdAt).toLocaleDateString()}`
      }`;
  }

  return label;
};

// We use a proxy to avoid exposing the client token in the frontend
export const updateSignalement = async (
  id: string,
  status: Signalement.status
): Promise<Signalement> => {
  const response = await fetch("/api/proxy-signalement", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update signalement");
  }

  return response.json();
};
