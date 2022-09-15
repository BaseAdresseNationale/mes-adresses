import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Table, Checkbox, Pane, Tooltip, WarningSignIcon} from 'evergreen-ui'

import {getNumeros} from '@/lib/bal-api'

import TableRowActions from '@/components/table-row/table-row-actions'
import TableRowEditShortcut from '@/components/table-row/table-row-edit-shortcut'
import TableRowNotifications from '@/components/table-row/table-row-notifications'

const TableRow = React.memo(({label, nomAlt, complement, voieId, secondary, notifications, isSelected, isEditingEnabled, handleSelect, actions}) => {
  const {onSelect, onEdit} = actions

  const [hasNoNumero, setHasNoNumero] = useState()

  useEffect(() => {
    const fetchNumeros = async () => {
      try {
        if (voieId) {
          const numeros = await getNumeros(voieId)
          setHasNoNumero(numeros.length === 0)
        } else {
          setHasNoNumero(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchNumeros()
  }, [voieId])

  const onClick = useCallback(e => {
    if (e.target.closest('[data-editable]') && isEditingEnabled) {
      onEdit()
    } else if (onSelect && e.target.closest('[data-browsable]')) {
      onSelect()
    }
  }, [isEditingEnabled, onEdit, onSelect])

  return (
    <Table.Row onClick={onClick} paddingRight={8} minHeight={48}>
      {isEditingEnabled && handleSelect && (
        <Table.Cell flex='0 1 1'>
          <Checkbox
            checked={isSelected}
            onChange={handleSelect}
          />
        </Table.Cell>
      )}

      <TableRowEditShortcut
        label={label}
        nomAlt={nomAlt}
        complement={complement}
        isEditingEnabled={isEditingEnabled}
        isSelectable={Boolean(onSelect)}
      />

      {secondary && (
        <Table.TextCell flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}

      {hasNoNumero && (
        <Pane display='flex' alignItems='center' paddingLeft={8}>
          <Tooltip content='Cette adresse ne dispose pas de numéro'>
            <WarningSignIcon color='orange500' />
          </Tooltip>
        </Pane>
      )}

      {notifications && (
        <TableRowNotifications {...notifications} />
      )}

      {isEditingEnabled && actions && (
        <TableRowActions {...actions} />
      )}
    </Table.Row>
  )
})

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  nomAlt: PropTypes.object,
  complement: PropTypes.string,
  voieId: PropTypes.string,
  secondary: PropTypes.string,
  handleSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  isEditingEnabled: PropTypes.bool,
  notifications: PropTypes.object,
  actions: PropTypes.shape({
    onSelect: PropTypes.func,
    onEdit: PropTypes.func,
  }).isRequired
}

TableRow.defaultProps = {
  complement: null,
  nomAlt: null,
  secondary: null,
  voieId: null,
  notifications: null,
  handleSelect: null,
  isSelected: false,
  isEditingEnabled: false
}

export default TableRow
