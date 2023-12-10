import PropTypes from "prop-types";
import { Pane, Button } from "evergreen-ui";

import { pauseSync, resumeSync } from "@/lib/bal-api";

import StatusBadge from "@/components/status-badge";
import BANSync from "@/components/sub-header/bal-status/ban-sync";
import RefreshSyncBadge from "@/components/sub-header/bal-status/refresh-sync-badge";

function BALStatus({
  baseLocale,
  commune,
  token,
  isHabilitationValid,
  isRefrehSyncStat,
  handlePublication,
  handleHabilitation,
  reloadBaseLocale,
}) {
  const handlePause = async () => {
    await pauseSync(baseLocale._id, token);
    await reloadBaseLocale();
  };

  const handleResumeSync = async () => {
    await resumeSync(baseLocale._id, token);
    await reloadBaseLocale();
  };

  return (
    <>
      <Pane height={28} marginRight={8}>
        {isRefrehSyncStat ? (
          <RefreshSyncBadge />
        ) : (
          <StatusBadge
            status={baseLocale.status}
            sync={baseLocale.sync}
            isHabilitationValid={isHabilitationValid}
          />
        )}
      </Pane>

      {token &&
        (baseLocale.sync && isHabilitationValid ? (
          <BANSync
            baseLocale={baseLocale}
            commune={commune}
            handleSync={handlePublication}
            togglePause={
              baseLocale.sync.isPaused ? handleResumeSync : handlePause
            }
            isHabilitationValid={isHabilitationValid}
          />
        ) : (
          baseLocale.status === "draft" && (
            <Button
              marginRight={8}
              height={24}
              appearance="primary"
              onClick={handleHabilitation}
            >
              Publier
            </Button>
          )
        ))}
    </>
  );
}

BALStatus.defaultProps = {
  token: null,
};

BALStatus.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    sync: PropTypes.object,
  }).isRequired,
  commune: PropTypes.object.isRequired,
  token: PropTypes.string,
  isHabilitationValid: PropTypes.bool.isRequired,
  isRefrehSyncStat: PropTypes.bool.isRequired,
  handlePublication: PropTypes.func.isRequired,
  handleChangeStatus: PropTypes.func.isRequired,
  handleHabilitation: PropTypes.func.isRequired,
  reloadBaseLocale: PropTypes.func.isRequired,
};

export default BALStatus;
