import { useState, useEffect, useCallback, useContext } from "react";
import { Pane, Paragraph, Strong } from "evergreen-ui";

import { Revision } from "@/types/revision.type";

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
        par <Strong>[nom de l’organisme partenaire]</Strong>. Vous n’avez pas
        nécessairement besoin de créer une BAL si votre commune a noué un
        partenariat avec cet organisme.
      </Paragraph>
      <Paragraph marginTop={16}>
        En cas de doute, merci de prendre attache auprès de cet organisme en
        contactant : <Strong>[Email de contact du partenaire]</Strong>
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
