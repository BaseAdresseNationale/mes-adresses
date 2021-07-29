import React from 'react'
import PropTypes from 'prop-types'

import BaseLocale from './base-locale'
import Communes from './communes'
import Voies from './voies'
import Toponymes from './toponymes'
import Numeros from './numeros'
import Publication from './publication'

export const TABS = [
  'Base locale',
  'Communes',
  'Voies',
  'Toponymes',
  'Numéros',
  'Publication',
]

function HelpTabs({tab}) {
  switch (tab) {
    case 0:
      return <BaseLocale />
    case 1:
      return <Communes />
    case 2:
      return <Voies />
    case 3:
      return <Toponymes />
    case 4:
      return <Numeros />
    case 5:
      return <Publication />
    default:
      return <BaseLocale />
  }
}

HelpTabs.propTypes = {
  tab: PropTypes.number.isRequired,
}

export default HelpTabs
