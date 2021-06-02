import React, {useContext} from 'react'
import {Pane, Label, Badge, Alert, TrashIcon} from 'evergreen-ui'

import ParcellesContext from '../../../contexts/parcelles'

function SelectParcelles() {
  const {selectedParcelles, hoveredParcelle, handleHoveredParcelle, handleParcelle} = useContext(ParcellesContext)

  return (
    <Pane display='flex' flexDirection='column' marginY='1em'>
      <Label marginBottom={4} display='block'>
        Parcelles cadastre
      </Label>
      <Pane>
        {selectedParcelles.length > 0 ?
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
                {parcelle}{isHovered && <TrashIcon marginLeft={4} color='danger' verticalAlign='middle' />}
              </Badge>
            )
          }) : (
            <Alert marginBottom={16}>
              Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au numéro.
            </Alert>
          )}
      </Pane>
    </Pane>
  )
}

export default SelectParcelles
