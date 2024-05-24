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

interface SignalementFormProps {
  signalement: Signalement;
  existingLocation: Voie | Toponyme | Numero;
  requestedToponyme?: Toponyme;
  onSubmit: (status: Signalement.status) => Promise<void>;
  onClose: () => void;
}

function SignalementForm({
  signalement,
  existingLocation,
  requestedToponyme,
  onSubmit,
  onClose,
}: SignalementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setViewport } = useContext(MapContext);

  // Point the map to the location of the signalement
  useEffect(() => {
    let pointTo = null;

    if ((existingLocation as Numero).positions?.length > 0) {
      const position = (existingLocation as Numero).positions[0];
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    } else if ((existingLocation as Voie).centroid) {
      pointTo = {
        latitude: (existingLocation as Voie).centroid.coordinates[1],
        longitude: (existingLocation as Voie).centroid.coordinates[0],
      };
    } else if (
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
    }

    if (pointTo) {
      setViewport({
        latitude: pointTo.latitude,
        longitude: pointTo.longitude,
        zoom: 20,
      });
    }
  }, [existingLocation, signalement.changesRequested, setViewport]);

  const handleSubmit = async (status: Signalement.status) => {
    try {
      setIsLoading(true);
      await onSubmit(status);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    await handleSubmit(Signalement.status.PROCESSED);
  };

  const handleReject = async () => {
    await handleSubmit(Signalement.status.IGNORED);
  };

  return (
    <Form
      editingId={existingLocation.id}
      closeForm={onClose}
      onFormSubmit={(e) => {
        e.preventDefault();

        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={signalement} />

      {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
        <SignalementCreateNumero
          signalement={signalement}
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
            existingLocation={existingLocation as Voie}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ) : (
          <SignalementUpdateToponyme
            signalement={signalement}
            existingLocation={existingLocation as Toponyme}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ))}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementDeleteNumero
          existingLocation={existingLocation as Numero}
          handleClose={onClose}
          handleAccept={handleAccept}
          handleReject={handleReject}
          isLoading={isLoading}
        />
      )}
    </Form>
  );
}

export default SignalementForm;
