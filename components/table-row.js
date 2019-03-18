import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton} from 'evergreen-ui'

function TableRow({
  id,
  code,
  label,
  secondary,

  isSelectable,

  renderEditor,

  onSelect,
  onEdit,
  onRemove
}) {
  const [isEditing, setIsEditing] = useState(false)

  const onClick = useCallback(e => {
    if (e.target.closest('[data-browsable]')) {
      onSelect(id)
    }
  }, [id, onSelect])

  const onEnableEditing = useCallback(() => {
    setIsEditing(true)
  }, [])

  const onDisableEditing = useCallback(() => {
    setIsEditing(false)
  }, [])

  const _onRemove = useCallback(async () => {
    if (onRemove) {
      onRemove(id)
    }
  }, [id, onRemove])

  const _onEdit = useCallback(async result => {
    if (onEdit) {
      await onEdit(id, result)
    }

    setIsEditing(false)
  }, [id, onEdit])

  if (isEditing) {
    return (
      <Table.Row height='auto'>
        <Table.Cell display='block' paddingY={12} background='tint1'>
          {renderEditor({
            id,
            code,
            label,
            onSubmit: _onEdit,
            onCancel: onDisableEditing
          })}
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <Table.Row isSelectable={isSelectable} onClick={onClick}>
      {code && (
        <Table.TextCell data-browsable isNumber flex='0 1 1'>{code}</Table.TextCell>
      )}
      <Table.TextCell data-browsable>{label}</Table.TextCell>
      {secondary && (
        <Table.TextCell data-browsable flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}
      {(renderEditor || onRemove) && (
        <Table.TextCell flex='0 1 1'>
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                {renderEditor && (
                  <Menu.Group>
                    <Menu.Item icon='edit' onSelect={onEnableEditing}>
                      Modifier
                    </Menu.Item>
                  </Menu.Group>
                )}
                {onRemove && (
                  <Menu.Group>
                    <Menu.Item icon='trash' intent='danger' onSelect={_onRemove}>
                      Supprimer…
                    </Menu.Item>
                  </Menu.Group>
                )}
              </Menu>
            }
          >
            <IconButton height={24} icon='more' appearance='minimal' className='foo' />
          </Popover>
        </Table.TextCell>
      )}
    </Table.Row>
  )
}

TableRow.propTypes = {
  isSelectable: PropTypes.bool
}

TableRow.defaultProps = {
  isSelectable: true
}

export default TableRow
