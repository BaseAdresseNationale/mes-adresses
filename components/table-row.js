import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton, toaster} from 'evergreen-ui'

const TableRow = React.memo(({
  id,
  code,
  label,
  secondary,

  isSelectable,

  renderEditor,

  onSelect,
  onEdit,
  onRemove
}) => {
  const onClick = useCallback(e => {
    if (isSelectable) {
      if (e.target.closest('[data-browsable]')) {
        onSelect(id)
      }
    }
  }, [id, isSelectable, onSelect])

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
      {(onEdit || onRemove) && (
        <Table.TextCell flex='0 1 1'>
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                <Menu.Group>
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
            <IconButton height={24} icon='more' appearance='minimal' />
          </Popover>
        </Table.TextCell>
      )}
    </Table.Row>
  )
})

TableRow.propTypes = {
  isSelectable: PropTypes.bool
}

TableRow.defaultProps = {
  isSelectable: true
}

export default TableRow
