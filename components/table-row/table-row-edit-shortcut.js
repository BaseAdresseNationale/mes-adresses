import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table, EditIcon} from 'evergreen-ui'

const TableRowEditShortcut = React.memo(({label, complement, isEditingEnabled, isSelectable}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <Table.Cell
      data-browsable
      style={isSelectable ? {cursor: 'pointer', backgroundColor: hovered ? '#E4E7EB' : '#fff'} : null}
      onMouseEnter={() => setHovered(isSelectable)}
      onMouseLeave={() => setHovered(false)}
    >
      <Table.TextCell
        data-editable
        flex='0 1 1'
        style={{cursor: isEditingEnabled ? 'text' : 'pointer'}}
        className='edit-cell'
      >
        <Pane padding={1}>
          {label} {complement && <i>{` - ${complement}`}</i>}
          {isEditingEnabled && (
            <span className='pencil-icon'>
              <EditIcon marginBottom={-4} marginLeft={8} />
            </span>
          )}
        </Pane>
      </Table.TextCell>

      <style global jsx>{`
        .edit-cell .pencil-icon {
          display: none;
        }

        .edit-cell:hover .pencil-icon {
          display: inline-block;
        }
        `}</style>
    </Table.Cell>
  )
})

TableRowEditShortcut.propTypes = {
  label: PropTypes.string.isRequired,
  complement: PropTypes.string,
  isEditingEnabled: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool.isRequired
}

TableRowEditShortcut.defaultProps = {
  complement: null
}

export default TableRowEditShortcut
