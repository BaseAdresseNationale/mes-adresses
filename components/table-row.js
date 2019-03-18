import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton} from 'evergreen-ui'

function TableRow({
  id,
  code,
  label,
  secondary,

  onSelect,
  onEdit,
  onDelete
}) {
  const onClick = useCallback(e => {
    if (e.target.closest('[data-browsable]')) {
      onSelect(id)
    }
  }, [id, onSelect])

  return (
    <Table.Row isSelectable onClick={onClick}>
      {code && (
        <Table.TextCell data-browsable isNumber flex='0 1 1'>{code}</Table.TextCell>
      )}
      <Table.TextCell data-browsable>{label}</Table.TextCell>
      {secondary && (
        <Table.TextCell data-browsable flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}
      {(onEdit || onDelete) && (
        <Table.TextCell flex='0 1 1'>
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                {onEdit && (
                  <>
                    <Menu.Group>
                      <Menu.Item icon='edit'>
                        Modifier
                      </Menu.Item>
                    </Menu.Group>
                    <Menu.Divider />
                  </>
                )}
                {onDelete && (
                  <Menu.Group>
                    <Menu.Item icon='trash' intent='danger'>
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

export default TableRow
