import PropTypes from 'prop-types'
import {Popover, Pane, Alert, Button, Position, CaretDownIcon} from 'evergreen-ui'

import BANHistory from '@/components/sub-header/bal-status/ban-sync/ban-history'
import SyncButton from '@/components/sub-header/bal-status/ban-sync/sync-button'

function BANSync({baseLocale, commune, handleSync, togglePause, computedStatus}) {
  const {sync} = baseLocale
  const {intent, title, content} = computedStatus

  return (
    <Pane>
      <Popover
        content={
          <Pane
            width={500}
            display='flex'
            flexDirection='column'
            gap={8}
            padding={8}
          >
            <Alert intent={intent} title={title}>
              {content}
            </Alert>

            <BANHistory
              baseLocaleId={baseLocale._id}
              syncStatus={sync.status}
              commune={commune}
            />

            <SyncButton
              isSync={sync.status === 'synced'}
              isConflicted={sync.status === 'conflict'}
              isPaused={sync.isPaused}
              handleSync={handleSync}
              togglePause={togglePause}
            />
          </Pane>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          height={28}
          appearance='primary'
          iconAfter={CaretDownIcon}
        >
          Base Adresse Nationale
        </Button>
      </Popover>
    </Pane>
  )
}

BANSync.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['replaced', 'published']).isRequired,
    sync: PropTypes.shape({
      status: PropTypes.oneOf(['synced', 'conflict', 'outdated']).isRequired,
      isPaused: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  commune: PropTypes.object.isRequired,
  handleSync: PropTypes.func.isRequired,
  togglePause: PropTypes.func.isRequired,
  computedStatus: PropTypes.shape({
    intent: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired
}

export default BANSync
