import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Position, Tooltip, EndorsedIcon, WarningSignIcon, CommentIcon, Checkbox} from 'evergreen-ui'

import TableRowActions from '@/components/table-row/table-row-actions'
import TableRowEditShortcut from './table-row/table-row-edit-shortcut'

const TableRow = React.memo(({id, label, complement, warning, comment, secondary, isSelectable, isSelected, isEditingEnabled, isCertified, handleSelect, actions}) => {
  const {onSelect, onEdit, onRemove} = actions

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && isEditingEnabled) {
      onEdit(id)
    } else if (onSelect && e.target.closest('[data-browsable]')) {
      onSelect(id)
    }
  }, [id, isEditingEnabled, onEdit, onSelect])

  return (
    <Table.Row onClick={onClick}>
      {isEditingEnabled && isSelectable && (
        <Table.Cell flex='0 1 1'>
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelect(id)}
          />
        </Table.Cell>
      )}

      <TableRowEditShortcut
        label={label}
        complement={complement}
        isEditingEnabled={isEditingEnabled}
        isSelectable={Boolean(onSelect)}
      />

      {secondary && (
        <Table.TextCell flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}

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

      {isCertified && (
        <Table.TextCell flex='0 1 1'>
          <Tooltip content='Cette adresse est certifiée par la commune' position={Position.BOTTOM}>
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

      {isEditingEnabled && actions && (
        <TableRowActions
          onSelect={() => onSelect(id)}
          onEdit={() => onEdit(id)}
          onRemove={() => onRemove(id)}
        />
      )}
    </Table.Row>
  )
})

TableRow.propTypes = {
  id: PropTypes.string.isRequired,
  warning: PropTypes.string,
  label: PropTypes.string.isRequired,
  complement: PropTypes.string,
  comment: PropTypes.string,
  secondary: PropTypes.string,
  isSelectable: PropTypes.bool,
  handleSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  isCertified: PropTypes.bool,
  isEditingEnabled: PropTypes.bool,
  actions: PropTypes.shape({
    onSelect: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  }).isRequired
}

TableRow.defaultProps = {
  complement: null,
  warning: null,
  comment: null,
  secondary: null,
  isSelectable: false,
  handleSelect: null,
  isSelected: false,
  isCertified: false,
  isEditingEnabled: false
}

export default TableRow
