import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Paragraph} from 'evergreen-ui'

import Footer from './footer'

const FullscreenContainer = ({title, subtitle, children}) => {
  return (
    <Pane height='100%' display='flex' flexDirection='column' >
      <Pane borderBottom padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>{title}</Heading>
        <Paragraph>
          {subtitle}
        </Paragraph>
      </Pane>

      <Pane flex={1} display='flex' overflowY='scroll'>
        {children}
      </Pane>

      <Footer />
    </Pane>
  )
}

FullscreenContainer.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default FullscreenContainer
