import {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Checkbox, CircleArrowUpIcon, PlayIcon, PauseIcon, AutomaticUpdatesIcon} from 'evergreen-ui'

function SyncButton({isSync, isConflicted, isPaused, handleSync, togglePause}) {
  const [isActionHovered, setIsActionHovered] = useState(false)
  const [isManualActionConfirmed, setIsManuelActionConfirmed] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleDisabledButton = async () => {
    setIsDisabled(true)
    await handleSync()
    setIsDisabled(false)
  }

  if (isConflicted) {
    return (
      <Pane>
        <Button
          width='100%'
          intent='danger'
          appearance='primary'
          onClick={handleDisabledButton}
          disabled={!isManualActionConfirmed || isDisabled}
        >
          Forcer la mise à jour
        </Button>
        <Checkbox
          checked={isManualActionConfirmed}
          label='Je comprend que ma Base Adresse Locale remplacera celle actuellement synchronisée avec la Base Adresses Nationale'
          onChange={() => setIsManuelActionConfirmed(!isManualActionConfirmed)}
        />
      </Pane>
    )
  }

  if (isPaused) {
    return (
      <Button
        width='100%'
        appearance='primary'
        intent='success'
        iconAfter={PlayIcon}
        onClick={togglePause}
      >
        Relancer la mise à jour automatique
      </Button>
    )
  }

  return (
    <Pane display='flex' flexDirection='column'>
      <Button
        width='100%'
        iconAfter={isActionHovered ? CircleArrowUpIcon : AutomaticUpdatesIcon}
        appearance={isActionHovered ? 'primary' : 'default'}
        onMouseEnter={() => setIsActionHovered(true)}
        onMouseLeave={() => setIsActionHovered(false)}
        onClick={handleSync}
        disabled={isSync}
      >
        {isActionHovered ? 'Mettre à jour' : 'Mise à jour automatique'}
      </Button>
      <Button
        appearance='minimal'
        iconAfter={PauseIcon}
        onClick={togglePause}
      >
        Suspendre la mise à jour automatique
      </Button>
    </Pane>
  )
}

SyncButton.propTypes = {
  isSync: PropTypes.bool,
  isConflicted: PropTypes.bool,
  isPaused: PropTypes.bool,
  handleSync: PropTypes.func.isRequired,
  togglePause: PropTypes.func.isRequired
}

export default SyncButton
