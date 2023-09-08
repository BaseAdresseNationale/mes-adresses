import PropTypes from 'prop-types'
import {Pane, Tooltip, Button, Position, EditIcon} from 'evergreen-ui'

import {pauseSync, resumeSync} from '@/lib/bal-api'

import StatusBadge from '@/components/status-badge'
import BANSync from '@/components/sub-header/bal-status/ban-sync'
import Publication from '@/components/sub-header/bal-status/publication'
import RefreshSyncBadge from '@/components/sub-header/bal-status/refresh-sync-badge'
import {getComputedStatus} from '@/lib/statuses'

function BALStatus({baseLocale, commune, token, isHabilitationValid, habilitationStatus, isRefrehSyncStat, handlePublication, handleChangeStatus, handleHabilitation, reloadBaseLocale}) {
  const handlePause = async () => {
    await pauseSync(baseLocale._id, token)
    await reloadBaseLocale()
  }

  const handleResumeSync = async () => {
    await resumeSync(baseLocale._id, token)
    await reloadBaseLocale()
  }

  const computedStatus = getComputedStatus(baseLocale.status, baseLocale.sync, habilitationStatus)

  return (
    <>
      <Pane height={28} marginRight={8}>
        {isRefrehSyncStat ? (
          <RefreshSyncBadge />
        ) : (
          <StatusBadge {...computedStatus} />
        )}
      </Pane>

      {token ? (
        baseLocale.sync && isHabilitationValid ? (
          <BANSync
            baseLocale={baseLocale}
            commune={commune}
            handleSync={handlePublication}
            togglePause={baseLocale.sync.isPaused ? handleResumeSync : handlePause}
            computedStatus={computedStatus}
          />
        ) : (
          baseLocale.status !== 'demo' && (
            <Publication
              status={baseLocale.status}
              handleBackToDraft={() => handleChangeStatus('draft')}
              onPublish={handleHabilitation}
              cta={computedStatus.cta}
            />
          )
        )
      ) : (
        <Tooltip
          content='Vous n’êtes pas identifié comme administrateur de cette base adresse locale, vous ne pouvez donc pas l’éditer.'
          position={Position.BOTTOM_RIGHT}
        >
          <Button
            height={24}
            marginRight={8}
            appearance='primary'
            intent='danger'
            iconBefore={EditIcon}
          >
            Édition impossible
          </Button>
        </Tooltip>
      )}
    </>
  )
}

BALStatus.defaultProps = {
  token: null
}

BALStatus.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    sync: PropTypes.object
  }).isRequired,
  commune: PropTypes.object.isRequired,
  token: PropTypes.string,
  isHabilitationValid: PropTypes.bool.isRequired,
  habilitationStatus: PropTypes.string,
  isRefrehSyncStat: PropTypes.bool.isRequired,
  handlePublication: PropTypes.func.isRequired,
  handleChangeStatus: PropTypes.func.isRequired,
  handleHabilitation: PropTypes.func.isRequired,
  reloadBaseLocale: PropTypes.func.isRequired
}

export default BALStatus
