import React from 'react'
import {Pane} from 'evergreen-ui'
import BackButton from '../../components/back-button'

import {getBalAccess} from '../../lib/tokens'

const BackToUserBALs = () => {
  const access = getBalAccess()
  return Object.keys(access).length > 0 ? (
    <Pane marginLeft={16} marginY={8}>
      <BackButton is='a' href='/'>Retour à la liste de mes Bases Adresses Locales</BackButton>
    </Pane>
  ) : null
}

export default BackToUserBALs
