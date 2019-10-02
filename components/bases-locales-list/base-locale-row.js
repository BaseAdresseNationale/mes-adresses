import React from 'react'
import PropTypes from 'prop-types'
import {Table, Badge, IconButton} from 'evergreen-ui'

function getBadge(status) {
  switch (status) {
    case 'published':
      return {color: 'green', label: 'Publiée'}
    case 'ready-to-publish':
      return {color: 'blue', label: 'Prête à être publiée'}
    default:
      return {color: 'neutral', label: 'Brouillon'}
  }
}

function BaseLocaleRow({baseLocale, editable, onSelect, onRemove}) {
  const {_id, nom, communes, status} = baseLocale
  const badge = getBadge(status)

  return (
    <Table.Row key={_id} isSelectable onSelect={onSelect}>
      <Table.TextCell flexGrow={2}>{nom}</Table.TextCell>
      <Table.TextCell>
        {communes.length < 2 ? `${communes.length} commune` : `${communes.length} communes`}
      </Table.TextCell>
      <Table.Cell>
        <Badge color={badge.color}>{badge.label}</Badge>
      </Table.Cell>
      <Table.TextCell flexBasis={100} flexGrow={0}>
        {status === 'draft' && editable && (
          <IconButton icon='trash' intent='danger' onClick={onRemove} />
        )}
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
    status: PropTypes.oneOf([
      'draft', 'ready-to-publish', 'published'
    ])
  }).isRequired,
  editable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func

}

export default BaseLocaleRow
