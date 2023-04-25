import PropTypes from 'prop-types'
import {Table, Checkbox} from 'evergreen-ui'

import TableRowEditShortcut from '@/components/table-row/table-row-edit-shortcut'

function RowNumerosDeleted({label, nomAlt, complement, secondary, isSelected, handleSelect}) {
  return (
    <Table.Row paddingRight={8} minHeight={48}>
      {handleSelect && (
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
        isSelectable={false}
        isEditingEnabled={false}
      />

      {secondary && (
        <Table.TextCell flex='0 1 1'>
          {secondary}
        </Table.TextCell>
      )}

    </Table.Row>
  )
}

RowNumerosDeleted.propTypes = {
  label: PropTypes.string.isRequired,
  nomAlt: PropTypes.string,
  complement: PropTypes.string,
  secondary: PropTypes.string,
  isSelected: PropTypes.bool,
  handleSelect: PropTypes.func.isRequired
}

RowNumerosDeleted.defaultProps = {
  complement: null,
  secondary: null,
  nomAlt: null,
  isSelected: false,
}

export default RowNumerosDeleted
