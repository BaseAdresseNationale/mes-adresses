import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, Strong} from 'evergreen-ui'

function RevisionUser({context, habilitation, communeName}) {
  let userName = context.nomComplet || context.organisation

  if (!userName) {
    if (habilitation.strategy.type === 'email') {
      userName = `mairie de ${communeName}`
    }

    if (habilitation.strategy.type === 'franceconnect') {
      userName = `élu(e) de ${communeName}`
    }
  }

  return (
    <Pane display='flex' gap={4}>
      <Text>Par</Text>
      {userName ? (
        <Strong>{userName}</Strong>
      ) : (
        <Text fontStyle='italic'>Non renseigné</Text>
      )}
    </Pane>
  )
}

RevisionUser.propTypes = {
  communeName: PropTypes.string.isRequired,
  context: PropTypes.shape({
    nomComplet: PropTypes.string,
    organisation: PropTypes.string
  }).isRequired,
  habilitation: PropTypes.shape({
    strategy: PropTypes.shape({
      type: PropTypes.oneOf(['email', 'franceconnect']).isRequired
    })
  })
}

export default React.memo(RevisionUser)
