import SignalementPage from "@/components/signalement/signalement-page";
import { BasesLocalesService, Toponyme, Voie } from "@/lib/openapi-api-bal";
import {
  ExistingNumero,
  NumeroChangesRequestedDTO,
  Signalement,
  SignalementsService,
} from "@/lib/openapi-signalement";
import {
  getAlreadyExistingLocation,
  getExistingLocation,
  isNumeroChangesRequested,
  matchExistingToponyme,
} from "@/lib/utils/signalement";
import { ObjectId } from "bson";

export default async function SignalementPageSSR({
  params,
}: {
  params: Promise<{
    balId: string;
    idSignalement: string;
  }>;
}) {
  const { balId, idSignalement } = await params;

  const voies = await BasesLocalesService.findBaseLocaleVoies(balId);
  const toponymes = await BasesLocalesService.findBaseLocaleToponymes(balId);

  const signalement =
    await SignalementsService.getSignalementById(idSignalement);

  if ((signalement.changesRequested as NumeroChangesRequestedDTO).positions) {
    (signalement.changesRequested as NumeroChangesRequestedDTO).positions = (
      signalement.changesRequested as NumeroChangesRequestedDTO
    ).positions.map((p) => ({
      ...p,
      id: new ObjectId().toHexString(),
    }));
  }

  let existingLocation = null;
  const requestedLocations: {
    toponyme?: Toponyme | null;
    voie?: Voie | null;
  } = {};

  if (
    signalement.status === Signalement.status.PROCESSED ||
    signalement.status === Signalement.status.IGNORED
  ) {
    return (
      <SignalementPage
        existingLocation={existingLocation}
        signalement={signalement}
        requestedLocations={requestedLocations}
      />
    );
  }

  try {
    if (signalement.existingLocation) {
      existingLocation = await getExistingLocation(
        signalement,
        voies,
        toponymes
      );
      if (
        signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        signalement.existingLocation.type === ExistingNumero.type.NUMERO &&
        (signalement.existingLocation as ExistingNumero).toponyme.nom !==
          (signalement.changesRequested as NumeroChangesRequestedDTO).nomVoie
      ) {
        requestedLocations.voie =
          matchExistingToponyme(
            {
              nom: (signalement.changesRequested as NumeroChangesRequestedDTO)
                .nomVoie,
              banId: (signalement.changesRequested as NumeroChangesRequestedDTO)
                .banIdVoie,
            },
            voies
          ) || null;
      }
    } else if (
      !signalement.existingLocation &&
      isNumeroChangesRequested(signalement.changesRequested)
    ) {
      // In case of a creation, we check if the street already exists
      existingLocation = getAlreadyExistingLocation(signalement, voies);
    }
  } catch (err) {
    console.error(err);
    existingLocation = null;
  }

  if (!existingLocation) {
    existingLocation = null;
  }

  if (
    (signalement.changesRequested as NumeroChangesRequestedDTO).nomComplement
  ) {
    requestedLocations.toponyme =
      matchExistingToponyme(
        {
          nom: (signalement.changesRequested as NumeroChangesRequestedDTO)
            .nomComplement,
          banId: (signalement.changesRequested as NumeroChangesRequestedDTO)
            .banIdComplement,
        },
        toponymes
      ) || null;
  }

  return (
    <SignalementPage
      signalement={signalement}
      existingLocation={existingLocation}
      requestedLocations={requestedLocations}
    />
  );
}
