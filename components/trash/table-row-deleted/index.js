import PropTypes from 'prop-types'
import {Table} from 'evergreen-ui'

import TableRowDeleteActions from '@/components/trash/table-row-deleted/table-row-action-deleted'
import TableRowEditShortcut from '@/components/table-row/table-row-edit-shortcut'

function TableRow({label, nomAlt, isDeleted, complement, actions}) {
  return (
    <Table.Row paddingRight={8} minHeight={48}>

      <TableRowEditShortcut
        label={label}
        nomAlt={nomAlt}
        complement={complement}
        isSelectable={false}
        isEditingEnabled={false}
        colors={{
          label: isDeleted ? 'danger' : 'default',
        }}
      />

      { actions && (
        <TableRowDeleteActions actions={actions} />
      )}
    </Table.Row>
  )
}

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  nomAlt: PropTypes.object,
  isDeleted: PropTypes.bool,
  complement: PropTypes.string,
  actions: PropTypes.array
}

TableRow.defaultProps = {
  nomAlt: null,
  complement: null,
  isDeleted: true,
  actions: []
}

export default TableRow
