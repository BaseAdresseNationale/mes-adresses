import React, {useState, useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton, toaster, Tooltip, Icon} from 'evergreen-ui'

import TokenContext from '../contexts/token'

const TableRow = React.memo(({id, code, label, comment, secondary, isSelectable, onSelect, isInconnuType, onEdit, onRemove}) => {
  const [hovered, setHovered] = useState(false)
  const {token} = useContext(TokenContext)

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && !code) { // Not a commune
      onEdit(id)
    } else if (isSelectable) {
      if (e.target.closest('[data-browsable]')) {
        onSelect(id)
      }
    }
  }, [code, id, isSelectable, onEdit, onSelect])

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
    <Table.Row isSelectable={isSelectable} onClick={onClick}>
      {code && (
        <Table.TextCell data-browsable isNumber flex='0 1 1'>{code}</Table.TextCell>
      )}
      <Table.Cell
        data-editable
        style={{cursor: onEdit ? 'text' : 'default'}}
        onMouseEnter={() => _onMouseEnter(id)}
        onMouseLeave={_onMouseLeave}
      >
        <Table.TextCell>
          {label} {hovered && (
            <Icon marginBottom={-4} marginLeft={8} icon='edit' />
          )}
        </Table.TextCell>
      </Table.Cell>
      <Table.Cell data-browsable />
      {secondary && (
        <Table.TextCell data-browsable flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}
      {comment && (
        <Table.Cell>
          <Tooltip
            content={comment}
            position={Position.BOTTOM_RIGHT}
          >
            <Icon icon='comment' color='muted' />
          </Tooltip>
        </Table.Cell>
      )}
      {isInconnuType && (
        <Table.TextCell flex='0 1 1'>
          <Tooltip content='Le type de la position est inconnu' position={Position.BOTTOM}>
            <Icon icon='warning-sign' color='warning' style={{verticalAlign: 'bottom'}} />
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
                    <Menu.Item icon='send-to-map' onSelect={() => onSelect(id)}>
                      Consulter
                    </Menu.Item>
                  )}
                  {onEdit && (
                    <Menu.Item icon='edit' onSelect={_onEdit}>
                      Modifier
                    </Menu.Item>
                  )}
                  {onRemove && (
                    <Menu.Item icon='trash' intent='danger' onSelect={_onRemove}>
                      Supprimer…
                    </Menu.Item>
                  )}
                </Menu.Group>
              </Menu>
            }
          >
            <IconButton type='button' height={24} icon='more' appearance='minimal' />
          </Popover>
        </Table.TextCell>
      )}
    </Table.Row>
  )
})

TableRow.propTypes = {
  id: PropTypes.string.isRequired,
  code: PropTypes.string,
  label: PropTypes.string.isRequired,
  comment: PropTypes.string,
  secondary: PropTypes.string,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  isInconnuType: PropTypes.bool,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func.isRequired
}

TableRow.defaultProps = {
  code: null,
  comment: null,
  secondary: null,
  isSelectable: true,
  isInconnuType: false,
  onEdit: null
}

export default TableRow
