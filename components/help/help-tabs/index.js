import PropTypes from 'prop-types'

import BaseLocale from './base-locale'
import Voies from './voies'
import Toponymes from './toponymes'
import Numeros from './numeros'
import Publication from './publication'

export const TABS = [
  'Base locale',
  'Voies',
  'Toponymes',
  'Numéros',
  'Publication'
]

function HelpTabs({tab}) {
  switch (tab) {
    case 0:
      return <BaseLocale />
    case 1:
      return <Voies />
    case 2:
      return <Toponymes />
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
