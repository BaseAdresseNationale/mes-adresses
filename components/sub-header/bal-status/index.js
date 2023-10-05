import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {pauseSync, resumeSync} from '@/lib/bal-api'

import StatusBadge from '@/components/status-badge'
import BANSync from '@/components/sub-header/bal-status/ban-sync'
import Publication from '@/components/sub-header/bal-status/publication'
import RefreshSyncBadge from '@/components/sub-header/bal-status/refresh-sync-badge'

function BALStatus({baseLocale, commune, token, isHabilitationValid, isRefrehSyncStat, handlePublication, handleChangeStatus, handleHabilitation, reloadBaseLocale}) {
  const handlePause = async () => {
    await pauseSync(baseLocale._id, token)
    await reloadBaseLocale()
  }

  const handleResumeSync = async () => {
    await resumeSync(baseLocale._id, token)
    await reloadBaseLocale()
  }

  return (
    <>
      <Pane height={28} marginRight={8}>
        {isRefrehSyncStat ? (
          <RefreshSyncBadge />
        ) : (
          <StatusBadge status={baseLocale.status} sync={baseLocale.sync} />
        )}
      </Pane>

      {token && (
        baseLocale.sync && isHabilitationValid ? (
          <BANSync
            baseLocale={baseLocale}
            commune={commune}
            handleSync={handlePublication}
            togglePause={baseLocale.sync.isPaused ? handleResumeSync : handlePause}
          />
        ) : (
          baseLocale.status !== 'demo' && (
            <Publication
              baseLocale={baseLocale}
              status={baseLocale.status}
              handleBackToDraft={() => handleChangeStatus('draft')}
              onPublish={handleHabilitation}
            />
          )
        )
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
  isRefrehSyncStat: PropTypes.bool.isRequired,
  handlePublication: PropTypes.func.isRequired,
  handleChangeStatus: PropTypes.func.isRequired,
  handleHabilitation: PropTypes.func.isRequired,
  reloadBaseLocale: PropTypes.func.isRequired
}

export default BALStatus
