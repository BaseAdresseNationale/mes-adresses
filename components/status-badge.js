import PropTypes from 'prop-types'
import {Pane, Badge, Position, Tooltip, Icon} from 'evergreen-ui'

function StatusBadge({color, label, content, icon}) {
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
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired
}

export default StatusBadge
