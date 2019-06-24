import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane, Icon} from 'evergreen-ui'

const SubTuto = ({title, icon, children}) => {
  return (
    <Pane marginTop={16}>
      <Heading display='flex' alignItems='center'>
        {title} {icon && <Icon marginLeft={8} icon={icon} />}
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
  icon: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default SubTuto
