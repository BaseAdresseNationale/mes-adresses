import PropTypes from 'prop-types'
import {Popover, Pane, Alert, Button, Position, CaretDownIcon} from 'evergreen-ui'

import {computeStatus} from '../../../../lib/statutes'

import BANHistory from './ban-history'
import SyncButton from './sync-button'

function BANSync({baseLocale, codeCommune, handleSync, togglePause}) {
  const {status, sync} = baseLocale
  const {intent, title, content} = computeStatus(status, sync)

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

            <BANHistory codeCommune={codeCommune} />

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
      isPaused: PropTypes.bool.isRequired,
      lastUploadedRevisionId: PropTypes.string.isRequired,
      lastUploadedRevisionHash: PropTypes.string.isRequired,
      currentTimestamp: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  codeCommune: PropTypes.string.isRequired,
  handleSync: PropTypes.func.isRequired,
  togglePause: PropTypes.func.isRequired
}

export default BANSync
