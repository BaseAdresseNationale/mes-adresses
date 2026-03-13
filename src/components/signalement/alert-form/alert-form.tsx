"use client";

import { useContext, useEffect, useState } from "react";
import { Alert } from "@/lib/openapi-signalement";
import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import { MissingAddressAlertForm } from "./missing-address-alert-form";
import { signalementTypeMap } from "../signalement-type-badge";
import { UpdateOneReportDTO } from "@/lib/openapi-api-bal";

interface AlertFormProps {
  alert: Alert;
  author?: Alert["author"];
  onSubmit: (
    status: Alert["status"],
    reportDTO?: Omit<UpdateOneReportDTO, "status">
  ) => Promise<void>;
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
  }, [alert, map]);

  const handleSubmit = async (
    status: Alert["status"],
    reportDTO?: Omit<UpdateOneReportDTO, "status">
  ) => {
    try {
      setIsLoading(true);
      await onSubmit(status, reportDTO);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (context?: UpdateOneReportDTO["context"]) => {
    await handleSubmit(Alert.status.PROCESSED, { context });
  };

  const handleReject = async (rejectionReason?: string) => {
    await handleSubmit(Alert.status.IGNORED, { rejectionReason });
  };

  return alert.type === Alert.type.MISSING_ADDRESS ? (
    <MissingAddressAlertForm
      alert={alert}
      author={author}
      isLoading={isLoading}
      handleAccept={handleAccept}
      handleReject={handleReject}
      handleClose={onClose}
    />
  ) : null;
}
