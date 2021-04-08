import React, {useState, useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton, toaster, Tooltip, EditIcon, WarningSignIcon, CommentIcon, Checkbox, MoreIcon, SendToMapIcon, TrashIcon} from 'evergreen-ui'

import TokenContext from '../contexts/token'
import BalDataContext from '../contexts/bal-data'

const TableRow = React.memo(({id, code, positions, label, comment, secondary, isSelectable, onSelect, onEdit, onRemove, handleSelect, isSelected, toponyme}) => {
  const [hovered, setHovered] = useState(false)
  const {token} = useContext(TokenContext)
  const {numeros, isEditing, toponymes} = useContext(BalDataContext)
  const {type} = positions[0] || {}
  const hasNumero = numeros && numeros.length > 1

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && !isEditing && !code) { // Not a commune
      onEdit(id)
    } else if (isSelectable) {
      if (e.target.closest('[data-browsable]')) {
        onSelect(id)
      }
    }
  }, [code, id, isSelectable, isEditing, onEdit, onSelect])

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
    <Table.Row isSelectable={isSelectable} style={{backgroundColor: hovered ? '#f5f6f7' : ''}} onClick={onClick}>
      {token && !isEditing && hasNumero && (
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
      <Table.Cell data-browsable>
        <Table.TextCell
          data-editable
          flex='0 1 1'
          style={{cursor: onEdit && !isEditing ? 'text' : 'default'}}
          onMouseEnter={() => _onMouseEnter(id)}
          onMouseLeave={_onMouseLeave}
        >
          {label} <i>{toponyme && toponymes && ' - ' + toponymes.find(t => t._id === toponyme).nom + ' '}</i> {hovered && !isEditing && (
            <EditIcon marginBottom={-4} marginLeft={8} />
          )}
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
      {type === 'inconnue' && (
        <Table.TextCell flex='0 1 1'>
          <Tooltip content='Le type de la position est inconnu' position={Position.BOTTOM}>
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
                  {isSelectable && (
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
    </Table.Row>
  )
})

TableRow.propTypes = {
  id: PropTypes.string.isRequired,
  code: PropTypes.string,
  positions: PropTypes.array,
  label: PropTypes.string.isRequired,
  comment: PropTypes.string,
  toponyme: PropTypes.string,
  secondary: PropTypes.string,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func,
  isSelected: PropTypes.boolean
}

TableRow.defaultProps = {
  code: null,
  positions: [],
  comment: null,
  toponyme: null,
  secondary: null,
  isSelectable: true,
  onEdit: null,
  handleSelect: null,
  isSelected: false
}

export default TableRow
