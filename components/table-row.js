import React, {useState, useContext, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table, Position, Tooltip, EditIcon, EndorsedIcon, WarningSignIcon, CommentIcon, Checkbox} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import TableRowActions from '@/components/table-row/table-row-actions'

const TableRow = React.memo(({id, label, warning, comment, secondary, isSelectable, isSelected, toponymeId, isEditingEnabled, isCertified, handleSelect, actions}) => {
  const [hovered, setHovered] = useState(false)
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

  const _onMouseEnter = useCallback(() => {
    if (onEdit) {
      setHovered(true)
    }
  }, [onEdit])

  const _onMouseLeave = useCallback(() => {
    setHovered(false)
  }, [])

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

      <Table.Cell
        data-browsable
        style={onSelect ? {cursor: 'pointer', backgroundColor: hovered ? '#E4E7EB' : '#f5f6f7'} : null}
        onMouseEnter={() => _onMouseEnter(id)}
        onMouseLeave={_onMouseLeave}
      >
        <Table.TextCell
          data-editable
          flex='0 1 1'
          style={{cursor: isEditingEnabled && onEdit ? 'text' : 'default'}}
          className='edit-cell'
        >
          <Pane padding={1}>
            {label} <i>{toponymeName && ` - ${toponymeName}`}</i>
            {isEditingEnabled && onEdit && (
              <span className='pencil-icon'>
                <EditIcon marginBottom={-4} marginLeft={8} />
              </span>
            )}
          </Pane>
        </Table.TextCell>
      </Table.Cell>

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

      <style global jsx>{`
        .edit-cell .pencil-icon {
          display: none;
        }

        .edit-cell:hover .pencil-icon {
          display: inline-block;
        }
        `}</style>
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
