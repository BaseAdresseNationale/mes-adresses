import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import Breadcrumbs from './breadcrumbs'

const Header = React.memo(({baseLocale, commune, voie}) => {
  return (
    <Pane
      position='fixed'
      top={0}
      left={0}
      height={40}
      width='100%'
      background='tint1'
      elevation={1}
      zIndex={3}
    >
      <Breadcrumbs baseLocale={baseLocale} commune={commune} voie={voie} />
    </Pane>
  )
})

Header.propTypes = {
  baseLocale: PropTypes.object.isRequired,
  commune: PropTypes.object,
  voie: PropTypes.object
}

export default Header
