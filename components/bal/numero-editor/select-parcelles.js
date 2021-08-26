import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Badge, Alert, TrashIcon, ControlIcon, Text} from 'evergreen-ui'

import ParcellesContext from '../../../contexts/parcelles'

import InputLabel from '../../input-label'
import MapContext from '../../../contexts/map'

function SelectParcelles({isToponyme}) {
  const {showCadastre, setShowCadastre} = useContext(MapContext)
  const {selectedParcelles, hoveredParcelle, handleHoveredParcelle, handleParcelle} =
    useContext(ParcellesContext)
  const addressType = isToponyme ? 'toponyme' : 'numéro'

  return (
    <Pane display='flex' flexDirection='column' marginY='1em'>
      <InputLabel
        title='Parcelles cadastre'
        help={`Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au ${addressType}. En précisant les parcelles associées à cette adresse, vous accélérez sa réutilisation par de nombreux services, DDFiP, opérateurs de courrier, de fibre et de GPS.`}
      />
      <Pane>
        {selectedParcelles.length > 0 ? (
          selectedParcelles.map(parcelle => {
            const isHovered = parcelle === hoveredParcelle?.id

            return (
              <Badge
                key={parcelle}
                isInteractive
                color={parcelle === hoveredParcelle?.id ? 'red' : 'green'}
                margin={4}
                onClick={() => handleParcelle(parcelle)}
                onMouseEnter={() => handleHoveredParcelle({id: parcelle})}
                onMouseLeave={() => handleHoveredParcelle(null)}
              >
                {parcelle}
                {isHovered && (
                  <TrashIcon marginLeft={4} size={14} color='danger' verticalAlign='text-bottom' />
                )}
              </Badge>
            )
          })
        ) : (
          <Alert marginTop={8}>
            <Text>
              Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au {addressType}
              .
            </Text>
          </Alert>
        )}
      </Pane>

      <Button
        type='button'
        display='flex'
        justifyContent='center'
        marginTop={8}
        iconAfter={ControlIcon}
        onClick={() => setShowCadastre(!showCadastre)}
      >
        {showCadastre ? 'Masquer' : 'Afficher'} le cadastre
      </Button>
    </Pane>
  )
}

SelectParcelles.defaultProps = {
  isToponyme: false
}

SelectParcelles.propTypes = {
  isToponyme: PropTypes.bool
}

export default SelectParcelles
