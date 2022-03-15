import PropTypes from 'prop-types'
import {Pane, Badge, Position, Tooltip, Icon} from 'evergreen-ui'

import {computeStatus} from '@/lib/statuses'

function StatusBadge({status, sync}) {
  const {color, label, content, icon} = computeStatus(status, sync)

  return (
    <Tooltip
      position={Position.BOTTOM_RIGHT}
      content={content}
    >
      <Badge
        display='flex'
        justifyContent='center'
        color={color}
        height='100%'
        width='100%'
      >
        <Pane display='flex' alignItems='center'>
          {label} <Icon icon={icon} size={14} marginLeft={4} />
        </Pane>
      </Badge>
    </Tooltip>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'replaced',
    'published',
    'ready-to-publish',
    'draft',
    'demo',
  ]).isRequired,
  sync: PropTypes.shape({
    isPaused: PropTypes.bool.isRequired,
    status: PropTypes.oneOf([
      'synced',
      'outdated',
      'conflict'
    ]),
  })
}

export default StatusBadge
