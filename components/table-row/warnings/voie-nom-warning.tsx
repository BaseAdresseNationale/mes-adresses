import { useCallback, useContext, useState } from "react";
import { Paragraph, Pane, Text, Button, WarningSignIcon } from "evergreen-ui";
import NextLink from "next/link";
import { useRouter } from "next/router";

import BalDataContext from "@/contexts/bal-data";

import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  Toponyme,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import DialogWarningAction from "@/components/dialog-warning-action";
import MapContext from "@/contexts/map";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { Alert } from "@/lib/alerts/alerts.types";

interface VoieNomWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function VoieNomWarning({ baseLocale, voie }: VoieNomWarningProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <WarningSignIcon
          color="white"
          style={{ verticalAlign: "middle" }}
          marginRight={4}
        />
        <Text color="white">Le nom de la voie est incorrect</Text>
      </Pane>
      <Button
        is={NextLink}
        href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}`}
        title="Éditer la voie"
        size="small"
      >
        Corriger
      </Button>
    </>
  );
}

export default VoieNomWarning;
