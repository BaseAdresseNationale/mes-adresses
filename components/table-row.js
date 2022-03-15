import React, {useContext, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Table, Position, Tooltip, EndorsedIcon, WarningSignIcon, CommentIcon, Checkbox} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import TableRowActions from '@/components/table-row/table-row-actions'
import TableRowEditShortcut from './table-row/table-row-edit-shortcut'

const TableRow = React.memo(({id, label, warning, comment, secondary, isSelectable, isSelected, toponymeId, isEditingEnabled, isCertified, handleSelect, actions}) => {
  const {numeros, toponymes} = useContext(BalDataContext)
  const hasNumero = numeros && numeros.length > 1

  const {onSelect, onEdit, onRemove} = actions

  const toponymeName = useMemo(() => {
    if (toponymeId && toponymes) {
      const toponyme = toponymes.find(({_id}) => _id === toponymeId)
      return toponyme?.nom
    }
  }, [toponymeId, toponymes])

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && isEditingEnabled) {
      onEdit(id)
    } else if (onSelect && e.target.closest('[data-browsable]')) {
      onSelect(id)
    }
  }, [id, isEditingEnabled, onEdit, onSelect])

  return (
    <Table.Row onClick={onClick}>
      {isEditingEnabled && hasNumero && isSelectable && (
        <Table.Cell flex='0 1 1'>
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelect(id)}
          />
        </Table.Cell>
      )}

      <TableRowEditShortcut
        label={label}
        complement={toponymeName}
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
  comment: PropTypes.string,
  toponymeId: PropTypes.string,
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
  warning: null,
  comment: null,
  toponymeId: null,
  secondary: null,
  isSelectable: false,
  handleSelect: null,
  isSelected: false,
  isCertified: false,
  isEditingEnabled: false
}

export default TableRow
