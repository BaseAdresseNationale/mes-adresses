import { useMemo, useState } from "react";
import {
  Pane,
  Button,
  Checkbox,
  CircleArrowUpIcon,
  PlayIcon,
  PauseIcon,
  AutomaticUpdatesIcon,
  RefreshIcon,
} from "evergreen-ui";

function SyncButtonIsLoading() {
  return (
    <Pane display="flex" alignItems="center">
      Synchronisation en cours{" "}
      <span>
        <RefreshIcon size={16} />
      </span>
      <style jsx>{`
        /* Safari 4.0 - 8.0 */
        @-webkit-keyframes rotate {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        /* Standard syntax */
        @keyframes rotate {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        span {
          display: flex;
          width: 16px;
          height: 16px;
          margin-left: 8px;
          -webkit-animation: rotate 2s linear infinite; /* Safari */
          animation: rotate 2s linear infinite;
        }
      `}</style>
    </Pane>
  );
}

interface SyncButtonProps {
  isSync: boolean;
  isConflicted: boolean;
  isPaused: boolean;
  handleSync: () => void;
  togglePause: () => void;
}

function SyncButton({
  isSync,
  isConflicted,
  isPaused,
  handleSync,
  togglePause,
}: SyncButtonProps) {
  const [isActionHovered, setIsActionHovered] = useState(false);
  const [isManualActionConfirmed, setIsManuelActionConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSync = async () => {
    setIsLoading(true);
    await handleSync();
    setIsLoading(false);
  };

  if (isConflicted) {
    return (
      <Pane>
        <Button
          width="100%"
          intent="danger"
          appearance="primary"
          onClick={onSync}
          disabled={!isManualActionConfirmed || isLoading}
        >
          Forcer la mise à jour
        </Button>
        <Checkbox
          checked={isManualActionConfirmed}
          label="Je comprends que ma Base Adresse Locale remplacera celle actuellement synchronisée avec la Base Adresses Nationale"
          onChange={() => setIsManuelActionConfirmed(!isManualActionConfirmed)}
        />
      </Pane>
    );
  }

  if (isPaused) {
    return (
      <Button
        width="100%"
        appearance="primary"
        intent="success"
        iconAfter={PlayIcon}
        onClick={togglePause}
      >
        Relancer la mise à jour automatique
      </Button>
    );
  }

  return (
    <Pane display="flex" flexDirection="column">
      <Button
        width="100%"
        {...(!isLoading
          ? {
              iconAfter: isActionHovered
                ? CircleArrowUpIcon
                : AutomaticUpdatesIcon,
            }
          : {})}
        appearance={isLoading || isActionHovered ? "primary" : "default"}
        onMouseEnter={() => setIsActionHovered(true)}
        onMouseLeave={() => setIsActionHovered(false)}
        onClick={onSync}
        disabled={isSync || isLoading}
      >
        {isLoading ? (
          <SyncButtonIsLoading />
        ) : isActionHovered ? (
          "Mettre à jour"
        ) : (
          "Mise à jour automatique"
        )}
      </Button>
      <Button appearance="minimal" iconAfter={PauseIcon} onClick={togglePause}>
        Suspendre la mise à jour automatique
      </Button>
    </Pane>
  );
}

export default SyncButton;
