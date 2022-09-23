import PropTypes from 'prop-types'
import {Table, Position, Tooltip, EndorsedIcon, WarningSignIcon, CommentIcon} from 'evergreen-ui'

function TableRowNotifications({certification, comment, warning}) {
  return (
    <>
      {comment && (
        <Table.Cell flex='0 1 1'>
          <Tooltip
            content={comment}
            position={Position.BOTTOM_RIGHT}
          >
            <CommentIcon color='muted' />
          </Tooltip>
        </Table.Cell>
      )}

      {certification && (
        <Table.TextCell flex='0 1 1'>
          <Tooltip content={certification} position={Position.BOTTOM}>
            <EndorsedIcon color='success' style={{verticalAlign: 'bottom'}} />
          </Tooltip>
        </Table.TextCell>
      )}

      {warning && (
        <Table.TextCell flex='0 1 1'>
          <Tooltip content={warning} position={Position.BOTTOM}>
            <WarningSignIcon color='warning' style={{verticalAlign: 'bottom'}} />
          </Tooltip>
        </Table.TextCell>
      )}
    </>
  )
}

TableRowNotifications.propTypes = {
  certification: PropTypes.string,
  comment: PropTypes.string,
  warning: PropTypes.string,
}

TableRowNotifications.defaultProps = {
  certification: null,
  comment: null,
  warning: null
}

export default TableRowNotifications
