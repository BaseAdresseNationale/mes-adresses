import React, {useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Table, Popover, Menu, Position, IconButton, toaster} from 'evergreen-ui'

import TokenContext from '../contexts/token'

const TableRow = React.memo(({id, code, label, secondary, isSelectable, onSelect, onEdit, onRemove}) => {
  const {token} = useContext(TokenContext)

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && !code) { // Not a commune
      onEdit(id)
    } else if (isSelectable) {
      if (e.target.closest('[data-browsable]')) {
        onSelect(id)
      }
    }
  }, [id, isSelectable, onEdit, onSelect])

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
      <Table.Cell data-editable style={{cursor: 'text'}}>
        <Table.TextCell>{label}</Table.TextCell>
      </Table.Cell>
      <Table.Cell data-browsable />
      {secondary && (
        <Table.TextCell data-browsable flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}
      {token && (onEdit || onRemove) && (
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
  secondary: PropTypes.string,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func.isRequired
}

TableRow.defaultProps = {
  code: null,
  secondary: null,
  isSelectable: true,
  onEdit: null
}

export default TableRow
