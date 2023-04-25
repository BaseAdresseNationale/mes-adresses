import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table, EditIcon, Text} from 'evergreen-ui'

import LanguagePreview from '../bal/language-preview'

const TableRowEditShortcut = React.memo(({label, nomAlt, complement, colors, isEditingEnabled, isSelectable}) => {
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
        <Pane padding={1} fontSize={15}>
          <Text color={colors.label ? colors.label : 'default'}>{label}</Text>
          {complement && <Text color={colors.complement ? colors.complement : 'default'}><i>{` - ${complement}`}</i></Text>}
          {isEditingEnabled && (
            <span className='pencil-icon'>
              <EditIcon marginBottom={-4} marginLeft={8} />
            </span>
          )}
        </Pane>

        {nomAlt && (
          <Pane marginTop={4}>
            <LanguagePreview nomAlt={nomAlt} />
          </Pane>
        )}
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
  nomAlt: PropTypes.object,
  complement: PropTypes.string,
  colors: PropTypes.object,
  isEditingEnabled: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool.isRequired
}

TableRowEditShortcut.defaultProps = {
  complement: null,
  nomAlt: null,
  colors: {}
}

export default TableRowEditShortcut
