import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Strong, Pane, Select, Heading, Icon, Small, TrashIcon, MapMarkerIcon, IconButton, Button, AddIcon, FormField} from 'evergreen-ui'

import {positionsTypesList} from '@/lib/positions-types-list'

import MarkersContext from '@/contexts/markers'

import InputLabel from '@/components/input-label'

function PositionEditor({isToponyme, validationMessage}) {
  const {markers, addMarker, updateMarker, removeMarker} = useContext(MarkersContext)

  const handleAddMarker = () => {
    addMarker({type: isToponyme ? 'segment' : 'entrée'})
  }

  const handleChange = (e, marker) => {
    updateMarker(marker._id, {...marker, type: e.target.value})
  }

  const deletePosition = (e, marker) => {
    e.preventDefault()
    removeMarker(marker._id)
  }

  return (
    <FormField validationMessage={validationMessage}>
      <InputLabel
        title='Positions'
        help={markers.length > 1 ?
          'Déplacer les marqueurs sur la carte pour modifier les positions' :
          (markers.length === 1 ?
            `Déplacer le marqueur sur la carte pour déplacer le ${isToponyme ? 'toponyme' : 'numéro'}.` :
            `Déplacer le marqueur sur la carte pour placer le ${isToponyme ? 'toponyme' : 'numéro'}.`)}
      />

      {markers.length > 0 ? (
        <Pane display='grid' gridTemplateColumns='2fr .5fr 1fr 1fr .5fr'>
          <Strong fontWeight={400} paddingBottom='.5em'>Type</Strong>
          <div />
          <Strong fontWeight={400}>Latitude</Strong>
          <Strong fontWeight={400}>Longitude</Strong>
          <div />

          {markers.map(marker => (
            <React.Fragment key={marker._id}>
              <Select
                value={marker.type}
                marginBottom={8}
                height={32}
                onChange={e => handleChange(e, marker)}
              >
                {positionsTypesList.map(positionType => (
                  <option key={positionType.value} value={positionType.value}>
                    {positionType.name}
                  </option>
                ))}
              </Select>
              <Icon icon={MapMarkerIcon} size={22} margin='auto' />
              <Heading size={100} marginY='auto'>
                <Small>{marker.latitude && marker.latitude.toFixed(6)}</Small>
              </Heading>
              <Heading size={100} marginY='auto'>
                <Small>{marker.longitude && marker.longitude.toFixed(6)}</Small>
              </Heading>
              <IconButton
                disabled={isToponyme ? false : markers.length === 1}
                appearance='default'
                iconSize={15}
                icon={TrashIcon}
                intent='danger'
                onClick={e => deletePosition(e, marker)}
              />
            </React.Fragment>
          ))}
        </Pane>
      ) : (
        <Pane paddingBottom='.5em' textAlign='center'>
          <Heading size={400}>Ce toponyme n’a pas de position</Heading>
        </Pane>
      )}

      <Button
        type='button'
        iconBefore={AddIcon}
        appearance='primary'
        intent='success'
        width='100%'
        marginBottom={0}
        display='flex'
        justifyContent='center'
        onClick={handleAddMarker}
      >
        {`Ajouter une position au ${isToponyme ? 'toponyme' : 'numéro'}`}
      </Button>
    </FormField>
  )
}

PositionEditor.propTypes = {
  isToponyme: PropTypes.bool,
  validationMessage: PropTypes.string.isRequired
}

PositionEditor.defaultProps = {
  isToponyme: false
}

export default PositionEditor
