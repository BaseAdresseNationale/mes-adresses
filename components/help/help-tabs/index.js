import React from 'react'
import PropTypes from 'prop-types'

import BaseLocale from './base-locale'
import Communes from './communes'
import Voies from './voies'
import Numeros from './numeros'
import Publication from './publication'

export const TABS = [
  'Base locale',
  'Communes',
  'Voies',
  'Numéros',
  'Publication'
]

const HelpTabs = ({tab}) => {
  switch (tab) {
    case 0:
      return <BaseLocale />
    case 1:
      return <Communes />
    case 2:
      return <Voies />
    case 3:
      return <Numeros />
    case 4:
      return <Publication />
    default:
      return <BaseLocale />
  }
}

HelpTabs.propTypes = {
  tab: PropTypes.number.isRequired
}

export default HelpTabs
