import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Card} from 'evergreen-ui'

const Tuto = ({title, children}) => {
  return (
    <Card
      backgroundColor='white'
      elevation={1}
      display='flex'
      flexDirection='column'
      marginBottom={16}
      padding={16}
    >
      <Heading is='h2'>{title}</Heading>
      {children}
    </Card>
  )
}

Tuto.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Tuto
