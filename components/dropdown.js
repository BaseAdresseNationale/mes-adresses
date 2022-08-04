import PropTypes from 'prop-types'
import {Pane, Button, ChevronDownIcon, ChevronRightIcon} from 'evergreen-ui'

function Dropdown({children, isOpen, handleOpen, dropdownStyle}) {
  return (
    <Pane
      background={dropdownStyle === 'primary' ? 'transparent' : 'gray300'}
      border={dropdownStyle === 'primary' ? '1px solid #c1c4d6' : 'none'}
      boxShadow='0px 4px 4px #E6E8F0'
      padding={15}
      borderRadius={5}
      display='flex'
      justifyContent='space-between'
      width='100%'
    >
      {children}

      <Button
        onClick={handleOpen}
        background='none'
        border='none'
        height='fit-content'
        padding={0}
      >
        {isOpen ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
      </Button>
    </Pane>
  )
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  dropdownStyle: PropTypes.oneOf([
    'primary',
    'secondary'
  ])
}

Dropdown.defaultProps = {
  dropdownStyle: 'primary'
}

export default Dropdown
