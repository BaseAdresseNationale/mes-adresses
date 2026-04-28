import {
  Popover,
  Pane,
  Alert,
  Button,
  Position,
  CaretDownIcon,
} from "evergreen-ui";

import { computeStatus } from "@/lib/statuses";

import BANHistory from "@/components/sub-header/bal-status/ban-sync/ban-history";
import SyncButton from "@/components/sub-header/bal-status/ban-sync/sync-button";
import { BaseLocaleSync, ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { useContext } from "react";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import BALRecoveryContext from "@/contexts/bal-recovery";

interface BANSyncProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  isHabilitationValid: boolean;
  handleSync: () => void;
  togglePause: () => void;
}

function BANSync({
  baseLocale,
  commune,
  isHabilitationValid,
  handleSync,
  togglePause,
}: BANSyncProps) {
  const { otherBalIdPublished } = useContext(BALRecoveryContext);
  const { isMobile } = useContext(LayoutContext);
  const { intent, title, content } = computeStatus(
    baseLocale.status,
    baseLocale.sync,
    isHabilitationValid
  );

  return (
    <Pane>
      <Popover
        content={
          <Pane
            width={isMobile ? "100vw" : 500}
            display="flex"
            flexDirection="column"
            gap={8}
            padding={8}
          >
            <Alert intent={intent} title={title}>
              {content}
            </Alert>

            <BANHistory
              baseLocaleId={baseLocale.id}
              syncStatus={baseLocale.sync.status}
              commune={commune}
            />

            {!otherBalIdPublished && (
              <SyncButton
                isSync={baseLocale.sync.status === BaseLocaleSync.status.SYNCED}
                isConflicted={
                  baseLocale.sync.status === BaseLocaleSync.status.CONFLICT
                }
                isPaused={baseLocale.sync.isPaused}
                handleSync={handleSync}
                togglePause={togglePause}
              />
            )}
          </Pane>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button height={28} appearance="primary" iconAfter={CaretDownIcon}>
          {isMobile ? "Statut" : "Statut de synchronisation"}
        </Button>
      </Popover>
    </Pane>
  );
}

export default BANSync;
