import React, {useContext} from 'react'
import {Pane, Label, Badge, Alert} from 'evergreen-ui'

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
          selectedParcelles.map(parcelle => (
            <Badge
              key={parcelle}
              isInteractive
              color={parcelle === hoveredParcelle?.id ? 'yellow' : 'green'}
              margin={4}
              onClick={() => handleParcelle(parcelle)}
              onMouseEnter={() => handleHoveredParcelle({id: parcelle})}
              onMouseLeave={() => handleHoveredParcelle(null)}
            >
              {parcelle}
            </Badge>
          )) : (
            <Alert marginBottom={16}>
              Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au numéro.
            </Alert>
          )}
      </Pane>
    </Pane>
  )
}

export default SelectParcelles
