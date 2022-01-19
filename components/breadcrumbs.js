import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Link, Text, HomeIcon} from 'evergreen-ui'

function BaseLocalLink({baseLocale}) {
  return useMemo(() => {
    if (baseLocale.communes.length > 1) {
      return (
        <>
          <NextLink href='/'>
            <Link href='/'>
              <HomeIcon style={{verticalAlign: 'middle', color: '#000'}} />
            </Link>
          </NextLink>
          <Text color='muted'>{' > '}</Text>
          <NextLink href={`/bal?balId=${baseLocale._id}`} as={`/bal/${baseLocale._id}`}>
            <Link href={`/bal/${baseLocale._id}`}>
              {baseLocale.nom || 'Base Adresse Locale'}
            </Link>
          </NextLink>
        </>
      )
    }

    return (
      <>
        <NextLink href='/'>
          <Link href='/'>
            <HomeIcon style={{verticalAlign: 'middle', color: '#000'}} />
          </Link>
        </NextLink>
        <Text color='muted'>{' > '}</Text>
        <Text>{baseLocale.nom || 'Base Adresse Locale'}</Text>
      </>
    )
  }, [baseLocale])
}

function Breadcrumbs({baseLocale, commune, voie, toponyme, ...props}) {
  if (!commune) {
    return <BaseLocalLink baseLocale={baseLocale} />
  }

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

      <NextLink href={`/bal/commune?balId=${baseLocale._id}&codeCommune=${commune.code}`} as={`/bal/${baseLocale._id}/communes/${commune.code}`}>
        <Link href={`/bal/${baseLocale._id}/communes/${commune.code}`}>
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
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }),
  voie: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }),
  toponyme: PropTypes.shape({
    nom: PropTypes.string.isRequired
  })
}

Breadcrumbs.defaultProps = {
  commune: null,
  voie: null,
  toponyme: null
}

export default React.memo(Breadcrumbs)
