import React, {useContext} from 'react'
import {Pane, Button, Badge, Alert, TrashIcon, ControlIcon, Paragraph} from 'evergreen-ui'

import ParcellesContext from '../../../contexts/parcelles'

import InputLabel from '../../input-label'
import MapContext from '../../../contexts/map'

function SelectParcelles() {
  const {showCadastre, setShowCadastre} = useContext(MapContext)
  const {selectedParcelles, hoveredParcelle, handleHoveredParcelle, handleParcelle} = useContext(ParcellesContext)

  return (
    <Pane display='flex' flexDirection='column' marginY='1em'>
      <InputLabel
        title='Parcelles cadastre'
        help='Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au numéro. En précisant les parcelles associées à cette adresse, vous accélérez sa réutilisation par de nombreux services, DDFiP, opérateurs de courrier, de fibre et de GPS.'
      />
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
              <Paragraph>
                Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au numéro.
              </Paragraph>

              {!showCadastre && (
                <Button marginTop={8} iconAfter={ControlIcon} onClick={() => setShowCadastre(true)}>Afficher le cadastre</Button>
              )}
            </Alert>
          )}
      </Pane>
    </Pane>
  )
}

export default SelectParcelles
