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
import { ExtendedBaseLocaleDTO } from "@/lib/openapi";
import { CommuneType } from "@/types/commune";

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
            width={500}
            display="flex"
            flexDirection="column"
            gap={8}
            padding={8}
          >
            <Alert intent={intent} title={title}>
              {content}
            </Alert>

            <BANHistory
              baseLocaleId={baseLocale._id}
              syncStatus={baseLocale.sync.status}
              commune={commune}
            />

            <SyncButton
              isSync={baseLocale.sync.status === "synced"}
              isConflicted={baseLocale.sync.status === "conflict"}
              isPaused={baseLocale.sync.isPaused}
              handleSync={handleSync}
              togglePause={togglePause}
            />
          </Pane>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button height={28} appearance="primary" iconAfter={CaretDownIcon}>
          Base Adresse Nationale
        </Button>
      </Popover>
    </Pane>
  );
}

export default BANSync;
