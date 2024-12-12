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
  const { pendingSignalementsCount, archivedSignalementsCount } =
    useContext(SignalementContext);

  return (
    <Pane overflowY="auto">
      {!token && <ReadOnlyInfos openRecoveryDialog={openRecoveryDialog} />}
      {(pendingSignalementsCount > 0 || archivedSignalementsCount > 0) && (
        <SignalementsInfos
          balId={baseLocale.id}
          signalementCounts={{
            pending: pendingSignalementsCount,
            archived: archivedSignalementsCount,
          }}
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
