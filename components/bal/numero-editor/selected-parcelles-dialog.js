import PropTypes from 'prop-types'
import {Badge, TrashIcon, Dialog} from 'evergreen-ui'

function SelectedParcellesDialog({selectedParcelles, hoveredParcelle, handleParcelle, handleHoveredParcelle, isShown, setIsShown}) {
  return (
    <Dialog
      hasFooter={false}
      isShown={isShown}
      title='Parcelles sélectionnées'
      onCloseComplete={() => setIsShown(false)}
    >
      {selectedParcelles.map(parcelle => {
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
      })}
    </Dialog>
  )
}

SelectedParcellesDialog.defaultProps = {
  hoveredParcelle: null
}

SelectedParcellesDialog.propTypes = {
  selectedParcelles: PropTypes.array.isRequired,
  hoveredParcelle: PropTypes.object,
  handleParcelle: PropTypes.func.isRequired,
  handleHoveredParcelle: PropTypes.func.isRequired,
  isShown: PropTypes.bool.isRequired,
  setIsShown: PropTypes.func.isRequired
}

export default SelectedParcellesDialog
