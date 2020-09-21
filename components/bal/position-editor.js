import React from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInputField, SelectField, Alert} from 'evergreen-ui'

import {positionsTypesList} from '../../lib/positions-types-list'

function PositionEditor({type, marker, alert, onTypeChange}) {
  return (
    <Pane>
      <Pane display='flex'>
        <TextInputField
          readOnly
          disabled
          flex={1}
          label='Latitude'
          display='block'
          type='number'
          maxWidth={300}
          value={marker.latitude}
          marginBottom={16}
        />

        <TextInputField
          readOnly
          disabled
          flex={1}
          label='Longitude'
          display='block'
          type='number'
          maxWidth={300}
          value={marker.longitude}
          marginLeft={8}
          marginBottom={16}
        />
      </Pane>

      <SelectField
        flex={1}
        label='Type'
        display='block'
        marginBottom={16}
        value={type}
        onChange={onTypeChange}
      >
        {positionsTypesList.map(positionType => (
          <option key={positionType.value} value={positionType.value}>{positionType.name}</option>
        ))}
      </SelectField>

      {type === 'inconnue' && (
        <Alert marginBottom={16} intent='warning'>
          Veuillez sélectionner un autre type de position.
        </Alert>
      )}

      {alert && (
        <Alert marginBottom={16}>
          {alert}
        </Alert>
      )}
    </Pane>
  )
}

PositionEditor.propTypes = {
  type: PropTypes.string,
  marker: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }).isRequired,
  alert: PropTypes.string,
  onTypeChange: PropTypes.func.isRequired
}

PositionEditor.defaultProps = {
  type: 'entrée',
  alert: null
}

export default PositionEditor
