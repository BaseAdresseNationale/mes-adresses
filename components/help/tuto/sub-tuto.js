import PropTypes from 'prop-types'
import {Heading, Pane, IconButton} from 'evergreen-ui'

function SubTuto({title, icon, children}) {
  return (
    <Pane marginTop={16}>
      <Heading display='flex' alignItems='center'>
        {title} {icon && <IconButton marginLeft={8} icon={icon} />}
      </Heading>
      {children}
    </Pane>
  )
}

SubTuto.defaultProps = {
  icon: null
}

SubTuto.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  children: PropTypes.node.isRequired
}

export default SubTuto
