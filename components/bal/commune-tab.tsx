import React, { useContext } from "react";
import { Pane } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import CertificationInfos from "./certification-infos";
import HabilitationInfos from "./habilitation-infos";
import SignalementsInfos from "./signalement-infos";
import ReadOnlyInfos from "./read-only-infos";
import { CommuneType } from "@/types/commune";
import { BaseLocale } from "@/lib/openapi-api-bal";
import SignalementContext from "@/contexts/signalement";

interface CommuneTabProps {
  commune: CommuneType;
  openRecoveryDialog: () => void;
}

function CommuneTab({ commune, openRecoveryDialog }: CommuneTabProps) {
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const { signalementCounts } = useContext(SignalementContext);

  return (
    <Pane overflowY="auto">
      {!token && <ReadOnlyInfos openRecoveryDialog={openRecoveryDialog} />}
      {(signalementCounts.pending > 0 || signalementCounts.archived > 0) && (
        <SignalementsInfos
          balId={baseLocale.id}
          signalementCounts={signalementCounts}
        />
      )}
      {token && baseLocale.status !== BaseLocale.status.DEMO && (
        <HabilitationInfos commune={commune} />
      )}
      <CertificationInfos openRecoveryDialog={!token && openRecoveryDialog} />
    </Pane>
  );
}

export default CommuneTab;
