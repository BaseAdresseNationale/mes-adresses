import React from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton, EditIcon, MoreIcon, SendToMapIcon, TrashIcon} from 'evergreen-ui'

const TableRowActions = React.memo(({onSelect, onEdit, onRemove, extra}) => {
  return (
    <Table.TextCell flex='0 1 1'>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>
              {onSelect && (
                <Menu.Item icon={SendToMapIcon} onSelect={onSelect}>
                  Consulter
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item icon={EditIcon} onSelect={onEdit}>
                  Modifier
                </Menu.Item>
              )}
              {extra && (
                <Menu.Item icon={extra.icon} onSelect={extra.callback}>
                  {extra.text}
                </Menu.Item>
              )}
              {onRemove && (
                <Menu.Item icon={TrashIcon} intent='danger' onSelect={onRemove}>
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
  )
})

TableRowActions.propTypes = {
  onSelect: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  extra: PropTypes.exact({
    callback: PropTypes.func,
    icon: PropTypes.elementType,
    text: PropTypes.string,
  }),
}

TableRowActions.defaultProps = {
  onEdit: null,
  onSelect: null,
  onRemove: null,
  extra: null
}

export default TableRowActions
