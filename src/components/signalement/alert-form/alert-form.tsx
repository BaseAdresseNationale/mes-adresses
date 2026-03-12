"use client";

import { useContext, useEffect, useState } from "react";
import { Paragraph } from "evergreen-ui";
import { Alert } from "@/lib/openapi-signalement";
import { SignalementHeader } from "../signalement-header";
import SignalementContext from "@/contexts/signalement";
import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import Form from "@/components/form";
import { MissingAddressAlertForm } from "./missing-address-alert-form";
import { signalementTypeMap } from "../signalement-type-badge";

interface AlertFormProps {
  alert: Alert;
  author?: Alert["author"];
  onSubmit: (status: Alert["status"], reason?: string) => Promise<void>;
  onClose: () => void;
}

export function AlertForm({
  alert,
  author,
  onSubmit,
  onClose,
}: AlertFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { map } = useContext(MapContext);
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { pendingSignalementsCount } = useContext(SignalementContext);

  useEffect(() => {
    if (!map || !alert.point) {
      return;
    }

    map.flyTo({
      center: [alert.point.coordinates[0], alert.point.coordinates[1]],
      offset: [0, 0],
      zoom: 20,
      screenSpeed: 2,
    });

    addMarker({
      id: alert.id,
      isMapMarker: true,
      isDisabled: true,
      color: signalementTypeMap[alert.type]?.color || "red",
      longitude: alert.point.coordinates[0],
      latitude: alert.point.coordinates[1],
    });

    return () => {
      disableMarkers();
    };
  }, [alert, map, addMarker, disableMarkers]);

  const handleSubmit = async (status: Alert["status"], reason?: string) => {
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
    await handleSubmit(Alert.status.PROCESSED);
  };

  const handleReject = async (reason?: string) => {
    await handleSubmit(Alert.status.IGNORED, reason);
  };

  return (
    <Form
      closeForm={onClose}
      onFormSubmit={(e) => {
        e.preventDefault();
        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={alert} author={author} />

      {alert.type === Alert.type.MISSING_ADDRESS && (
        <MissingAddressAlertForm
          alert={alert}
          author={author}
          isLoading={isLoading}
          handleAccept={handleAccept}
          handleReject={handleReject}
          handleClose={onClose}
        />
      )}

      <Paragraph textAlign="center">
        Il reste {pendingSignalementsCount} signalement
        {pendingSignalementsCount === 1 ? "" : "s"} à traiter
      </Paragraph>
    </Form>
  );
}
