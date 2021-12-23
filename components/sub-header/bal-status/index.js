import PropTypes from 'prop-types'
import {Pane, Tooltip, Button, Position, EditIcon} from 'evergreen-ui'

import {sync, pauseSync, resumeSync} from '../../../lib/bal-api'

import StatusBadge from '../../status-badge'

import BANSync from './ban-sync'
import Publication from './publication'

function BALStatus({baseLocale, commune, token, handleChangeStatus, handleHabilitation, reloadBaseLocale}) {
  const handleSync = async () => {
    await sync(baseLocale._id, token)
    await reloadBaseLocale()
  }

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
        <StatusBadge status={baseLocale.status} sync={baseLocale.sync} />
      </Pane>

      {token ? (
        baseLocale.sync ? (
          <BANSync
            baseLocale={baseLocale}
            commune={commune}
            handleSync={handleSync}
            togglePause={baseLocale.sync.isPaused ? handleResumeSync : handlePause}
          />
        ) : (
          <Publication
            baseLocale={baseLocale}
            status={baseLocale.status}
            handleBackToDraft={() => handleChangeStatus('draft')}
            onPublish={handleHabilitation}
          />
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
  handleChangeStatus: PropTypes.func.isRequired,
  handleHabilitation: PropTypes.func.isRequired,
  reloadBaseLocale: PropTypes.func.isRequired
}

export default BALStatus
