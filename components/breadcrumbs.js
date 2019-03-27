import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Link, Text} from 'evergreen-ui'

function Breadcrumbs({baseLocale, commune, voie}) {
  if (!commune) {
    return (
      <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
        <Text>{baseLocale.nom}</Text>
      </Pane>
    )
  }

  if (!voie) {
    return (
      <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
        <NextLink href={`/bal?balId=${baseLocale._id}`} as={`/bal/${baseLocale._id}`}>
          <Link href={`/bal/${baseLocale._id}`}>
            {baseLocale.nom || 'Base Adresse Locale'}
          </Link>
        </NextLink>

        <Text color='muted'>{' > '}</Text>
        {commune.nom ? (
          <Text>{commune.nom}</Text>
        ) : (
          <Text fontStyle='italic'>Commune {commune.code}</Text>
        )}
      </Pane>
    )
  }

  return (
    <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
      <NextLink href={`/bal?balId=${baseLocale._id}`} as={`/bal/${baseLocale._id}`}>
        <Link display='inline-block' href={`/bal/${baseLocale._id}`}>
          {baseLocale.nom || 'Base Adresse Locale'}
        </Link>
      </NextLink>

      <Text color='muted'>{' > '}</Text>
      <NextLink href={`/bal/commune?balId=${baseLocale._id}&codeCommune=${commune.code}`} as={`/bal/${baseLocale._id}/communes/${commune.code}`}>
        {commune.nom ? (
          <Link href={`/bal/${baseLocale._id}/communes/${commune.code}`}>
            {commune.nom}
          </Link>
        ) : (
          <Link fontStyle='italic' href={`/bal/${baseLocale._id}/communes/${commune.code}`}>
            Commune {commune.code}
          </Link>
        )}
      </NextLink>

      <Text color='muted'>{' > '}</Text>
      <Text>{voie.nom}</Text>
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
    nom: PropTypes.string
  }),

  voie: PropTypes.shape({
    nom: PropTypes.string.isRequired
  })
}

export default React.memo(Breadcrumbs)
