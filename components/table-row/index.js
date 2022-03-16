import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Checkbox} from 'evergreen-ui'

import TableRowActions from '@/components/table-row/table-row-actions'
import TableRowEditShortcut from '@/components/table-row/table-row-edit-shortcut'
import TableRowNotifications from '@/components/table-row/table-row-notifications'

const TableRow = React.memo(({label, complement, secondary, notifications, isSelected, isEditingEnabled, handleSelect, actions}) => {
  const {onSelect, onEdit} = actions

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && isEditingEnabled) {
      onEdit()
    } else if (onSelect && e.target.closest('[data-browsable]')) {
      onSelect()
    }
  }, [isEditingEnabled, onEdit, onSelect])

  return (
    <Table.Row onClick={onClick} paddingRight={8}>
      {isEditingEnabled && handleSelect && (
        <Table.Cell flex='0 1 1'>
          <Checkbox
            checked={isSelected}
            onChange={handleSelect}
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

      {notifications && (
        <TableRowNotifications {...notifications} />
      )}

      {isEditingEnabled && actions && (
        <TableRowActions {...actions} />
      )}
    </Table.Row>
  )
})

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  complement: PropTypes.string,
  secondary: PropTypes.string,
  handleSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  isEditingEnabled: PropTypes.bool,
  notifications: PropTypes.object,
  actions: PropTypes.shape({
    onSelect: PropTypes.func,
    onEdit: PropTypes.func,
  }).isRequired
}

TableRow.defaultProps = {
  complement: null,
  secondary: null,
  notifications: null,
  handleSelect: null,
  isSelected: false,
  isEditingEnabled: false
}

export default TableRow
