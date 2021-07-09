import React, {useState, useContext, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table, Popover, Menu, Position, IconButton, toaster, Tooltip, EditIcon, WarningSignIcon, CommentIcon, Checkbox, MoreIcon, SendToMapIcon, TrashIcon} from 'evergreen-ui'

import TokenContext from '../contexts/token'
import BalDataContext from '../contexts/bal-data'

const TableRow = React.memo(({id, code, label, warning, comment, secondary, isSelectable, onSelect, onEdit, onRemove, handleSelect, isSelected, toponymeId}) => {
  const [hovered, setHovered] = useState(false)
  const {token} = useContext(TokenContext)
  const {numeros, isEditing, toponymes} = useContext(BalDataContext)
  const hasNumero = numeros && numeros.length > 1

  const toponymeName = useMemo(() => {
    if (toponymeId && toponymes) {
      const toponyme = toponymes.find(({_id}) => _id === toponymeId)
      return toponyme?.nom
    }
  }, [toponymeId, toponymes])

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && !isEditing && !code) { // Not a commune
      onEdit(id)
    } else if (onSelect) {
      if (e.target.closest('[data-browsable]')) {
        onSelect(id)
      }
    }
  }, [code, id, isEditing, onEdit, onSelect])

  const _onEdit = useCallback(() => {
    onEdit(id)
  }, [onEdit, id])

  const _onRemove = useCallback(async () => {
    try {
      await onRemove(id)
    } catch (error) {
      toaster.danger(`Erreur : ${error.message}`)
    }
  }, [onRemove, id])

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
      {token && !isEditing && hasNumero && isSelectable && (
        <Table.Cell flex='0 1 1'>
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelect(id)}
          />
        </Table.Cell>
      )}
      {code && (
        <Table.TextCell data-browsable isNumber flex='0 1 1'>{code}</Table.TextCell>
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
          style={{cursor: onEdit && !isEditing ? 'text' : 'default'}}
          className='edit-cell'
        >
          <Pane padding={1}>
            {label} <i>{toponymeName && ` - ${toponymeName}`}</i>
            {!isEditing && onEdit && token && (
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
      {warning && (
        <Table.TextCell flex='0 1 1'>
          <Tooltip content={warning} position={Position.BOTTOM}>
            <WarningSignIcon color='warning' style={{verticalAlign: 'bottom'}} />
          </Tooltip>
        </Table.TextCell>
      )}
      {token && (onEdit || onRemove) && (
        <Table.TextCell flex='0 1 1'>
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                <Menu.Group>
                  {onSelect && (
                    <Menu.Item icon={SendToMapIcon} onSelect={() => onSelect(id)}>
                      Consulter
                    </Menu.Item>
                  )}
                  {onEdit && !isEditing && (
                    <Menu.Item icon={EditIcon} onSelect={_onEdit}>
                      Modifier
                    </Menu.Item>
                  )}
                  {onRemove && (
                    <Menu.Item icon={TrashIcon} intent='danger' onSelect={_onRemove}>
                      Supprimer…
                    </Menu.Item>
                  )}
                </Menu.Group>
              </Menu>
            }
          >
            <IconButton type='button' height={24} icon={MoreIcon} appearance='minimal' />
          </Popover>
        </Table.TextCell>
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
  code: PropTypes.string,
  warning: PropTypes.string,
  label: PropTypes.string.isRequired,
  comment: PropTypes.string,
  toponymeId: PropTypes.string,
  secondary: PropTypes.string,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func,
  isSelected: PropTypes.bool
}

TableRow.defaultProps = {
  code: null,
  warning: null,
  comment: null,
  toponymeId: null,
  secondary: null,
  isSelectable: false,
  onEdit: null,
  handleSelect: null,
  onSelect: null,
  isSelected: false
}

export default TableRow
