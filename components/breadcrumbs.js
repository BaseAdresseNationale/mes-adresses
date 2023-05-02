import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Link, Text, HomeIcon} from 'evergreen-ui'

function BaseLocalLink({baseLocale}) {
  return useMemo(() => (
    <>
      <NextLink href='/' legacyBehavior>
        <Link href='/'>
          <HomeIcon style={{verticalAlign: 'middle', color: '#000'}} />
        </Link>
      </NextLink>
      <Text color='muted'>{' > '}</Text>
      <Text>{baseLocale.nom || 'Base Adresse Locale'}</Text>
    </>
  ), [baseLocale])
}

function Breadcrumbs({baseLocale, commune, voie, toponyme, ...props}) {
  if (!voie && !toponyme) {
    return (
      <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' {...props}>
        <BaseLocalLink baseLocale={baseLocale} />
        <Text color='muted'>{' > '}</Text>
        <Text>{commune.nom}</Text>
      </Pane>
    )
  }

  return (
    <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' {...props}>
      <BaseLocalLink baseLocale={baseLocale} />
      <Text color='muted'>{' > '}</Text>

      <NextLink href={`/bal?balId=${baseLocale._id}`} as={`/bal/${baseLocale._id}`} legacyBehavior>
        <Link href={`/bal/${baseLocale._id}`}>
          {commune.nom}
        </Link>
      </NextLink>

      <Text color='muted'>{' > '}</Text>
      <Text>{voie?.nom || toponyme.nom}</Text>
    </Pane>
  )
}

Breadcrumbs.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string
  }).isRequired,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired,
  voie: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }),
  toponyme: PropTypes.shape({
    nom: PropTypes.string.isRequired
  })
}

Breadcrumbs.defaultProps = {
  voie: null,
  toponyme: null
}

export default React.memo(Breadcrumbs)
