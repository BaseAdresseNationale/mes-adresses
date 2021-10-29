import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'

const Tuto = ({children}) => {
  return (
    <Pane
      borderLeft='default'
      float='left'
      marginBottom={8}
      padding={8}
      display='flex'
      flexDirection='column'
    >
      <Heading is='h2'>Vous rencontrez un problème ?</Heading>
      <Pane margin={8}>
        {children}
      </Pane>
    </Pane>
  )
}

Tuto.propTypes = {
  children: PropTypes.node.isRequired
}

export default Tuto
