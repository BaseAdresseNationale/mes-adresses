import React from 'react'
import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Text, StatusIndicator, Strong, Badge} from 'evergreen-ui'

import RevisionUser from './revision-user'

function getIndicatorColor(isCurrent, isUserBAL) {
  if (isCurrent) {
    return isUserBAL ? 'success' : 'danger'
  }

  return 'disabled'
}

function Revision({baseLocaleId, commune, revision}) {
  const isUserBAL = revision.context.extras?.balId === baseLocaleId
  const indicatorColor = getIndicatorColor(revision.current, isUserBAL)

  return (
    <Pane display='grid' gridTemplateColumns='10px 75px max-content max-content 24px' alignItems='center' gap={8}>
      <StatusIndicator color={indicatorColor} />

      <Badge>{new Date(revision.publishedAt).toLocaleDateString()}</Badge>

      <RevisionUser
        context={revision.context}
        habilitation={revision.habilitation}
        communeName={commune.nom}
      />

      <Pane>
        {revision.client?.nom && (
          <Text>via <Strong>{revision.client.nom}</Strong></Text>
        )}
      </Pane>

      <Pane display='flex' alignItems='center'>
        {isUserBAL && (
          <NextImage
            src='/static/images/ban-logo.png'
            alt='Logo Base Adresses Nationale'
            width={24}
            height={24}
          />
        )}
      </Pane>
    </Pane>
  )
}

Revision.propTypes = {
  baseLocaleId: PropTypes.string.isRequired,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired,
  revision: PropTypes.shape({
    current: PropTypes.bool.isRequired,
    client: PropTypes.shape({
      nom: PropTypes.string
    }).isRequired,
    context: PropTypes.shape({
      extras: PropTypes.shape({
        balId: PropTypes.string
      }).isRequired
    }).isRequired,
    habilitation: PropTypes.object.isRequired,
    publishedAt: PropTypes.string.isRequired,
  }).isRequired
}

export default React.memo(Revision)
