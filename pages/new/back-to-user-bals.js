import React from 'react'
import {BackButton, Pane} from 'evergreen-ui'

import {getBalAccess} from '../../lib/tokens'

const BackToUserBALs = () => {
  const access = getBalAccess()
  return Object.keys(access).length > 0 ? (
    <Pane marginLeft={16} marginTop={32}>
      <BackButton is='a' href='/'>Retour à la liste de mes Bases Adresses Locales</BackButton>
    </Pane>
  ) : null
}

export default BackToUserBALs
