import React from 'react'
import {BackButton} from 'evergreen-ui'

import {getBalAccess} from '../../lib/tokens'

const BackToUserBALs = () => {
  const access = getBalAccess()
  return Object.keys(access).length > 0 ? (
    <BackButton appearance='primary' intent='primary' is='a' href='/'>Voir vers mes Bases Adresses Locales</BackButton>
  ) : null
}

export default BackToUserBALs
