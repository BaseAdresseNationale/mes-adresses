"use client";

import { useState } from "react";
import { Alert } from "@/lib/openapi-signalement";
import { MissingAddressAlertForm } from "./missing-address-alert-form";
import { UpdateOneReportDTO } from "@/lib/openapi-api-bal";
import { useAlertMap } from "../hooks/useAlertMap";

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

  useAlertMap(alert);

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
