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
import { ClientRevisionEnum } from "./create-form";

interface AlertAlertPublishedBALApiDepotProps {
  revision: Revision;
}

function AlertPublishedBALApiDepot({
  revision,
}: AlertAlertPublishedBALApiDepotProps) {
  useEffect(() => {}, [revision]);

  return (
    <Pane>
      <Paragraph marginTop={16}>
        Attention, votre Base Adresse Locale (BAL) est actuellement déjà gérée
        par <b>{organisation}</b>. Vous n’avez pas nécessairement besoin de
        créer une BAL si votre commune a noué un partenariat avec cet organisme.
      </Paragraph>
      <Paragraph marginTop={16}>
        En cas de doute, merci de prendre attache auprès de cet organisme en
        contactant : <b>{emails}</b>
      </Paragraph>
      <Paragraph marginTop={16}>
        La commune reste toutefois l’autorité compétente en matière d’adressage,
        et vous pouvez décider à tout moment de reprendre la main sur la
        publication de votre BAL
      </Paragraph>
    </Pane>
  );
}

export default AlertPublishedBALApiDepot;
