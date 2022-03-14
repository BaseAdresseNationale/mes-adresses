import {useState, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Badge, Alert, TrashIcon, ControlIcon, Text} from 'evergreen-ui'

import SelectedParcellesDialog from './selected-parcelles-dialog'

import ParcellesContext from '../../../contexts/parcelles'

import InputLabel from '../../input-label'
import MapContext from '../../../contexts/map'

function SelectParcelles({isToponyme}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {isCadastreDisplayed, setIsCadastreDisplayed} = useContext(MapContext)
  const {selectedParcelles, hoveredParcelle, handleHoveredParcelle, handleParcelle} = useContext(ParcellesContext)
  const addressType = isToponyme ? 'toponyme' : 'numéro'

  const firstSelectedParcelles = useMemo(() => {
    if (selectedParcelles.length > 0) {
      return selectedParcelles.slice(0, 3)
    }
  }, [selectedParcelles])

  const lastSelectedParcelles = useMemo(() => {
    if (selectedParcelles.length > 3) {
      return selectedParcelles.slice(3)
    }
  }, [selectedParcelles])

  useEffect(() => {
    if (isDialogOpen && !lastSelectedParcelles) {
      setIsDialogOpen(false)
    }
  }, [isDialogOpen, lastSelectedParcelles])

  return (
    <Pane display='flex' flexDirection='column'>
      <InputLabel
        title='Parcelles cadastre'
        help={`Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au ${addressType}. En précisant les parcelles associées à cette adresse, vous accélérez sa réutilisation par de nombreux services, DDFiP, opérateurs de courrier, de fibre et de GPS.`}
      />
      <Pane>
        {selectedParcelles.length > 0 ?
          firstSelectedParcelles.map(parcelle => {
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
                {parcelle}{isHovered && <TrashIcon marginLeft={4} size={14} color='danger' verticalAlign='text-bottom' />}
              </Badge>
            )
          }) : (
            <Alert marginTop={8}>
              <Text>
                Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au {addressType}.
              </Text>
            </Alert>
          )}
      </Pane>

      {lastSelectedParcelles && (
        <>
          <SelectedParcellesDialog
            selectedParcelles={lastSelectedParcelles}
            hoveredParcelle={hoveredParcelle}
            handleParcelle={handleParcelle}
            handleHoveredParcelle={handleHoveredParcelle}
            isShown={isDialogOpen}
            setIsShown={setIsDialogOpen}
          />
          <Button marginTop={8} type='button' onClick={() => setIsDialogOpen(true)}>Afficher les autres parcelles sélectionnées ({lastSelectedParcelles.length})</Button>
        </>
      )}

      <Button
        type='button'
        display='flex'
        justifyContent='center'
        marginTop={8}
        iconAfter={ControlIcon}
        onClick={() => setIsCadastreDisplayed(!isCadastreDisplayed)}
      >
        {isCadastreDisplayed ? 'Masquer' : 'Afficher'} le cadastre
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
