import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Checkbox} from 'evergreen-ui'

import TableRowActions from '@/components/table-row/table-row-actions'
import TableRowEditShortcut from './table-row/table-row-edit-shortcut'
import TableRowNotifications from './table-row/table-row-notifications'

const TableRow = React.memo(({id, label, complement, secondary, notifications, isSelectable, isSelected, isEditingEnabled, handleSelect, actions}) => {
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

      {notifications && <TableRowNotifications {...notifications} />}

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
  label: PropTypes.string.isRequired,
  complement: PropTypes.string,
  secondary: PropTypes.string,
  isSelectable: PropTypes.bool,
  handleSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  isEditingEnabled: PropTypes.bool,
  notifications: PropTypes.object,
  actions: PropTypes.shape({
    onSelect: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  }).isRequired
}

TableRow.defaultProps = {
  complement: null,
  secondary: null,
  notifications: null,
  isSelectable: false,
  handleSelect: null,
  isSelected: false,
  isEditingEnabled: false
}

export default TableRow
