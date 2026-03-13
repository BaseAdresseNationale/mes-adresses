"use client";

import { useContext, useState } from "react";
import {
  BanCircleIcon,
  Button,
  Heading,
  Label,
  Pane,
  Paragraph,
  PlusIcon,
  Text,
  Textarea,
} from "evergreen-ui";
import { Alert as AlertType } from "@/lib/openapi-signalement";
import { BadgeSelect } from "@/components/badge-select";
import NumeroEditor from "@/components/bal/numero-editor";
import BalDataContext from "@/contexts/bal-data";
import SignalementContext from "@/contexts/signalement";
import {
  rejectionReasonsOptions,
  RejectionReasonOption,
} from "@/components/signalement/rejection-reasons";
import { SignalementHeader } from "../signalement-header";
import Form from "@/components/form";
import { MissingAddressContextDTO, Numero } from "@/lib/openapi-api-bal";
import { getAddressPreview } from "@/lib/utils/address";
import { useAlertMap } from "../hooks/useAlertMap";

interface MissingAddressAlertFormProps {
  alert: AlertType;
  author?: AlertType["author"];
  isLoading: boolean;
  handleAccept: (context: MissingAddressContextDTO) => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
}

export function MissingAddressAlertForm({
  alert,
  author,
  isLoading,
  handleAccept,
  handleReject,
  handleClose,
}: MissingAddressAlertFormProps) {
  const [showNumeroEditor, setShowNumeroEditor] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReasonSelected, setRejectionReasonSelected] =
    useState<RejectionReasonOption | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { commune } = useContext(BalDataContext);
  const { pendingSignalementsCount } = useContext(SignalementContext);

  useAlertMap(alert, !showNumeroEditor);

  const onCreateNewAddress = (_numero: Numero) => {
    const { numero, suffixe, banId, voie, toponyme } = _numero;
    const label = getAddressPreview(
      numero,
      suffixe,
      commune,
      toponyme?.nom,
      voie?.nom
    );

    return handleAccept({
      ...alert.context,
      createdAddress: {
        idBAN: banId,
        label,
      },
    });
  };

  if (showNumeroEditor) {
    return (
      <NumeroEditor
        commune={commune}
        closeForm={() => setShowNumeroEditor(false)}
        onSubmitted={onCreateNewAddress}
      />
    );
  }

  return (
    <Form
      closeForm={handleClose}
      onFormSubmit={(e) => {
        e.preventDefault();
        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={alert} author={author} />
      <Heading size={400} marginBottom={12}>
        Que souhaitez-vous faire ?
      </Heading>

      {showRejectionForm ? (
        <Pane>
          <Pane
            background="white"
            padding={8}
            borderRadius={8}
            marginBottom={8}
          >
            <Label htmlFor="reject-reason" marginBottom={8} display="block">
              <Text fontWeight="bold">Raison</Text>
              {author?.email && (
                <Text marginLeft={4} size={300} color="muted">
                  (L&apos;auteur du signalement recevra cette information par
                  email)
                </Text>
              )}
            </Label>
            <BadgeSelect
              options={rejectionReasonsOptions}
              onChange={(value: string) =>
                setRejectionReasonSelected(value as RejectionReasonOption)
              }
              value={rejectionReasonSelected}
            />
            {rejectionReasonSelected === "Autre" && (
              <Textarea
                id="reject-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Précisez la raison du refus, merci de ne pas indiquer de données personnelles"
                rows={4}
                resize="none"
              />
            )}
          </Pane>
          <Pane display="flex" justifyContent="center" gap={8}>
            <Button
              isLoading={isLoading}
              appearance="default"
              intent="danger"
              iconAfter={BanCircleIcon}
              onClick={async () => {
                await handleReject(
                  rejectionReasonSelected === "Autre"
                    ? rejectionReason
                    : rejectionReasonSelected
                );
                setShowRejectionForm(false);
                setRejectionReason("");
              }}
            >
              Refuser et{" "}
              {pendingSignalementsCount > 1 ? "passer au suivant" : "terminer"}
            </Button>
            <Button
              disabled={isLoading}
              appearance="default"
              onClick={() => setShowRejectionForm(false)}
            >
              Annuler
            </Button>
          </Pane>
        </Pane>
      ) : (
        <Pane display="flex" justifyContent="center" gap={8}>
          <Button
            disabled={isLoading}
            appearance="primary"
            intent="success"
            iconBefore={PlusIcon}
            onClick={() => setShowNumeroEditor(true)}
          >
            Créer une nouvelle adresse
          </Button>
          <Button
            disabled={isLoading}
            appearance="default"
            intent="danger"
            iconAfter={BanCircleIcon}
            onClick={() => setShowRejectionForm(true)}
          >
            Refuser
          </Button>
          <Button
            disabled={isLoading}
            appearance="default"
            onClick={handleClose}
          >
            Retour
          </Button>
        </Pane>
      )}
      <Paragraph textAlign="center" marginTop={12}>
        Il reste {pendingSignalementsCount} signalement
        {pendingSignalementsCount === 1 ? "" : "s"} à traiter
      </Paragraph>
    </Form>
  );
}
