import React from 'react'
import PropTypes from 'prop-types'
import {Table, Badge, IconButton} from 'evergreen-ui'

function BaseLocaleRow({baseLocale, editable, onSelect, onRemove}) {
  const {_id, nom, communes, published} = baseLocale

  return (
    <Table.Row key={_id} isSelectable onSelect={onSelect}>
      <Table.TextCell flexGrow={2}>{nom}</Table.TextCell>
      <Table.TextCell>
        {communes.length < 2 ? `${communes.length} commune` : `${communes.length} communes`}
      </Table.TextCell>
      <Table.Cell>
        {published ? (
          <Badge color='green'>Publiée</Badge>
        ) : (
          <Badge color='neutral'>Brouillon</Badge>
        )}</Table.Cell>
      <Table.TextCell flexBasis={100} flexGrow={0}>
        {!published && editable && <IconButton icon='trash' intent='danger' onClick={onRemove} />}
      </Table.TextCell>
    </Table.Row>
  )
}

BaseLocaleRow.defaultProps = {
  editable: false,
  onRemove: null
}

BaseLocaleRow.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    communes: PropTypes.array.isRequired,
    published: PropTypes.bool
  }).isRequired,
  editable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func

}

export default BaseLocaleRow
