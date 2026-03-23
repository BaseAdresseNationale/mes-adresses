import SignalementPage from "@/components/signalement/signalement-page";
import AlertPage from "@/components/signalement/alert-page";
import { BasesLocalesService, Toponyme, Voie } from "@/lib/openapi-api-bal";
import {
  Alert,
  ExistingNumero,
  NumeroChangesRequestedDTO,
  Signalement,
  SignalementsService,
  AlertsService,
} from "@/lib/openapi-signalement";
import {
  getAlreadyExistingLocation,
  getExistingLocation,
  isNumeroChangesRequested,
  matchExistingToponyme,
} from "@/lib/utils/signalement";
import { ObjectId } from "bson";

const fetchReport = async (idSignalement: string) => {
  let report: Signalement | Alert;
  try {
    report = await SignalementsService.getSignalementById(idSignalement);
  } catch {
    // If the report is not found in signalements, it might be an alert
    try {
      report = await AlertsService.getAlertById(idSignalement);
    } catch {
      throw new Error("Report not found");
    }
  }
  return report;
};

export default async function SignalementPageSSR({
  params,
}: {
  params: Promise<{
    balId: string;
    idSignalement: string;
  }>;
}) {
  const { balId, idSignalement } = await params;

  const report = await fetchReport(idSignalement);

  // If this is an alert, render the page directly without location resolution
  if (report.reportKind === Alert.reportKind.ALERT) {
    return <AlertPage alert={report as Alert} />;
  }

  const signalement = report as Signalement;

  const voies = await BasesLocalesService.findBaseLocaleVoies(balId);
  const toponymes = await BasesLocalesService.findBaseLocaleToponymes(balId);

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
