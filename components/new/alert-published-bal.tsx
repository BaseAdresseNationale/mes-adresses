import { useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { uniq } from "lodash";
import { Pane, Dialog, Alert, Paragraph, Strong } from "evergreen-ui";

import { ApiGeoService } from "@/lib/geo-api";

import LocalStorageContext from "@/contexts/local-storage";

import useError from "@/hooks/error";

import BaseLocaleCard from "@/components/base-locale-card";
import DeleteWarning from "@/components/delete-warning";
import { BasesLocalesService, ExtendedBaseLocaleDTO } from "@/lib/openapi";
import { Client, ContextRevision, Revision } from "@/types/revision.type";

interface AlertPublishedBALProps {
  isShown: boolean;
  revision: Revision;
  onClose: () => void;
  onConfirm: () => void;
}

function AlertPublishedBAL({
  isShown = false,
  revision,
  onClose,
  onConfirm,
}: AlertPublishedBALProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organisation, setOrganisation] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  console.log(revision);

  useEffect(() => {
    async function refreshOrganisationContact() {
      const client: Client = revision.client as Client;
      const context: ContextRevision = revision.context;
      if (client?.id === "mes-adresses") {
        if (context.extras?.balId) {
          const bal: ExtendedBaseLocaleDTO =
            await BasesLocalesService.findBaseLocale(context.extras?.balId);
          console.log(bal);
          setOrganisation(bal.nom);
          // setEmails(bal.emails);
        }
      }
    }
    refreshOrganisationContact();
  }, [revision]);

  const handleConfirmation = () => {
    setIsLoading(true);
    onConfirm();
  };

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Attention, votre Base Adresse Locale (BAL) est déjà publié"
        width="800px"
        confirmLabel={
          isLoading
            ? "En cours de création…"
            : "Créer une nouvelle Base Adresse Locale"
        }
        cancelLabel="Annuler"
        isConfirmLoading={isLoading}
        onConfirm={handleConfirmation}
        onCloseComplete={onClose}
      >
        <Pane>
          <Paragraph marginTop={16}>
            Attention, votre Base Adresse Locale (BAL) est actuellement déjà
            gérée par <b>{organisation}</b> [nom de l’organisme partenaire].
            Vous n’avez pas nécessairement besoin de créer une BAL si votre
            commune a noué un partenariat avec cet organisme.
          </Paragraph>
          <Paragraph marginTop={16}>
            En cas de doute, merci de prendre attache auprès de cet organisme en
            contactant : {emails.join(",")} [Email de contact du partenaire]
          </Paragraph>
          <Paragraph marginTop={16}>
            La commune reste toutefois l’autorité compétente en matière
            d’adressage, et vous pouvez décider à tout moment de reprendre la
            main sur la publication de votre BAL
          </Paragraph>
        </Pane>
      </Dialog>
    </>
  );
}

export default AlertPublishedBAL;
