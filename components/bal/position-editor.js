import React from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInputField, Alert} from 'evergreen-ui'

function PositionEditor({marker, alert}) {
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

      <Alert marginBottom={16}>
        {alert || 'Déplacez le marqueur sur la carte'}
      </Alert>
    </Pane>
  )
}

PositionEditor.propTypes = {
  marker: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }),
  alert: PropTypes.string
}

export default PositionEditor
