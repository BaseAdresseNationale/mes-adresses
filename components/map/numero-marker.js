import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, Text, Menu, Position, WarningSignIcon, TrashIcon, EndorsedIcon} from 'evergreen-ui'
import {Tooltip} from 'evergreen-ui/commonjs/tooltip'

import {computeCompletNumero} from '../../lib/utils/numero'

function NumeroMarker({numero, style, showContextMenu, setShowContextMenu, onEnableEditing, removeAddress}) {
  const position = numero.positions.find(position => position.type === 'entrée') || numero.positions[0]

  if (!position) {
    return null
  }

  const {coordinates} = position.point
  const completNumero = numero.numeroComplet || computeCompletNumero(numero.numero, numero.suffixe)

  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]} captureDrag={false}>
      <Pane {...style} paddingX={4} onClick={e => onEnableEditing(e, numero._id)} onContextMenu={() => setShowContextMenu(numero._id)}>
        <Text color='white' marginLeft={8} marginRight={4}>
          {completNumero}
        </Text>

        {numero.positions.find(position => position.type === 'inconnue') && (
          <Tooltip content='Le type d’une position est inconnu' position={Position.BOTTOM_RIGHT}>
            <WarningSignIcon color='warning' size={13} marginX={4} marginBottom={2} style={{verticalAlign: 'middle'}} />
          </Tooltip>
        )}

        {numero.certifie && (
          <Tooltip content='Cette adresse est certifiée par la commune' position={Position.RIGHT}>
            <EndorsedIcon color='success' size={13} marginX={4} marginBottom={2} style={{verticalAlign: 'middle'}} />
          </Tooltip>
        )}
      </Pane>

      {showContextMenu && (
        <Pane background='tint1' position='absolute' margin={10}>
          <Menu>
            <Menu.Group>
              <Menu.Item icon={TrashIcon} intent='danger' onSelect={() => removeAddress(numero._id)}>
                Supprimer…
              </Menu.Item>
            </Menu.Group>
          </Menu>
        </Pane>
      )}
    </Marker>
  )
}

NumeroMarker.propTypes = {
  numero: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    certifie: PropTypes.bool.isRequired,
    numeroComplet: PropTypes.string,
    numero: PropTypes.number.isRequired,
    suffixe: PropTypes.string,
    positions: PropTypes.arrayOf(PropTypes.shape({
      point: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
      }).isRequired,
      type: PropTypes.string
    }))
  }).isRequired,
  style: PropTypes.object.isRequired,
  showContextMenu: PropTypes.bool,
  setShowContextMenu: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  removeAddress: PropTypes.func.isRequired
}

NumeroMarker.defaultProps = {
  showContextMenu: false
}

export default React.memo(NumeroMarker)
