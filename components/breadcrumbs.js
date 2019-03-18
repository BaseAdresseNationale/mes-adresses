import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Link, Text} from 'evergreen-ui'

function Breadcrumbs({baseLocale, commune, voie}) {
  return (
    <Pane paddingY={4} paddingX={16} borderBottom='muted' background='tint1'>
      <NextLink href={`/bal?balId=${baseLocale._id}`} as={`/bal/${baseLocale._id}`}>
        <Link display='inline-block' href={`/bal/${baseLocale._id}`} marginY={6}>
          {baseLocale.nom || 'Base Adresse Locale'}
        </Link>
      </NextLink>
      {voie ? (
        <>
          <Text color='muted'>{' > '}</Text>
          <NextLink href={`/bal/commune?balId=${baseLocale._id}&codeCommune=${commune.code}`} as={`/bal/${baseLocale._id}/communes/${commune.code}`}>
            <Link display='inline-block' href={`/bal/${baseLocale._id}/communes/${commune.code}`} marginY={6}>
              {commune.nom}
            </Link>
          </NextLink>
          <Text color='muted'>{' > '}</Text>
          <Text>{voie.nom}</Text>
        </>
      ) : (
        <>
          <Text color='muted'>{' > '}</Text>
          <Text>{commune.nom}</Text>
        </>
      )}
    </Pane>
  )
}

Breadcrumbs.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string
  }).isRequired,

  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,

  voie: PropTypes.shape({
    nom: PropTypes.string.isRequired
  })
}

export default Breadcrumbs
