import React, { useContext, useEffect, useState } from "react";
import {
  ExistingLocation,
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { Numero, Toponyme, Voie } from "@/lib/openapi-api-bal";
import Form from "../../form";
import SignalementCreateNumero from "./numero/signalement-create-numero";
import SignalementUpdateNumero from "./numero/signalement-update-numero";
import SignalementUpdateVoie from "./voie/signalement-update-voie";
import SignalementUpdateToponyme from "./toponyme/signalement-update-toponyme";
import SignalementDeleteNumero from "./numero/signalement-delete-numero";
import MapContext from "@/contexts/map";
import { SignalementHeader } from "../signalement-header";
import SignalementContext from "@/contexts/signalement";
import { Paragraph } from "evergreen-ui";

interface SignalementFormProps {
  signalement: Signalement;
  author?: Signalement["author"];
  existingLocation: Voie | Toponyme | Numero | null;
  requestedToponyme?: Toponyme;
  onSubmit: (status: Signalement.status, reason?: string) => Promise<void>;
  onClose: () => void;
}

function SignalementForm({
  signalement,
  author,
  existingLocation,
  requestedToponyme,
  onSubmit,
  onClose,
}: SignalementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { map } = useContext(MapContext);
  const { pendingSignalementsCount } = useContext(SignalementContext);

  // Point the map to the location of the signalement
  useEffect(() => {
    if (!map) {
      return;
    }

    let pointTo = null;

    if (
      (signalement.changesRequested as NumeroChangesRequestedDTO).positions
        ?.length > 0
    ) {
      const position = (
        signalement.changesRequested as NumeroChangesRequestedDTO
      ).positions[0];
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    } else if ((existingLocation as Numero)?.positions?.length > 0) {
      const position = (existingLocation as Numero).positions[0];
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    } else if ((existingLocation as Voie)?.centroid) {
      pointTo = {
        latitude: (existingLocation as Voie).centroid.coordinates[1],
        longitude: (existingLocation as Voie).centroid.coordinates[0],
      };
    }

    if (pointTo) {
      map.flyTo({
        center: [pointTo.longitude, pointTo.latitude],
        offset: [0, 0],
        zoom:
          signalement.type === Signalement.type.LOCATION_TO_CREATE ||
          signalement.existingLocation.type === ExistingLocation.type.NUMERO
            ? 20
            : 16.5,
        screenSpeed: 2,
      });
    }
  }, [existingLocation, signalement, map]);

  const handleSubmit = async (status: Signalement.status, reason?: string) => {
    try {
      setIsLoading(true);
      await onSubmit(status, reason);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    await handleSubmit(Signalement.status.PROCESSED);
  };

  const handleReject = async (reason?: string) => {
    await handleSubmit(Signalement.status.IGNORED, reason);
  };

  return (
    <Form
      editingId={existingLocation?.id}
      closeForm={onClose}
      onFormSubmit={(e) => {
        e.preventDefault();

        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={signalement} author={author} />

      {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
        <SignalementCreateNumero
          signalement={signalement}
          author={author}
          handleClose={onClose}
          handleAccept={handleAccept}
          handleReject={handleReject}
          voie={existingLocation as Voie}
          isLoading={isLoading}
          requestedToponyme={requestedToponyme}
        />
      )}

      {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        (signalement.existingLocation.type === ExistingLocation.type.NUMERO ? (
          <SignalementUpdateNumero
            signalement={signalement}
            author={author}
            existingLocation={existingLocation as Numero}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
            requestedToponyme={requestedToponyme}
          />
        ) : signalement.existingLocation.type === ExistingLocation.type.VOIE ? (
          <SignalementUpdateVoie
            signalement={signalement}
            author={author}
            existingLocation={existingLocation as Voie}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ) : (
          <SignalementUpdateToponyme
            signalement={signalement}
            author={author}
            existingLocation={existingLocation as Toponyme}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ))}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementDeleteNumero
          author={author}
          existingLocation={existingLocation as Numero}
          handleClose={onClose}
          handleAccept={handleAccept}
          handleReject={handleReject}
          isLoading={isLoading}
        />
      )}
      <Paragraph textAlign="center">
        Il reste {pendingSignalementsCount} signalement
        {pendingSignalementsCount === 1 ? "" : "s"} à traiter
      </Paragraph>
    </Form>
  );
}

export default SignalementForm;
