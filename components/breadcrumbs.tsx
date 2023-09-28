import React from 'react'
import NextLink from 'next/link'
import {Pane, Text, HomeIcon, Link} from 'evergreen-ui'
import {BaseLocaleType} from '@/types/base-locale'
import {CommmuneType} from '@/types/commune'
import {VoieType} from '@/types/voie'
import {ToponymeType} from '@/types/toponyme'

interface BreadcrumbsProps {
  baseLocale: BaseLocaleType;
  commune: CommmuneType;
  voie?: VoieType;
  toponyme?: ToponymeType;
}

function Breadcrumbs({baseLocale, commune, voie, toponyme, ...props}: BreadcrumbsProps) {
  if (!voie && !toponyme) {
    return (
      <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' {...props}>
        <NextLink href='/'>
          <HomeIcon style={{verticalAlign: 'middle', color: '#000'}} />
        </NextLink>
        <Text color='muted'>{' > '}</Text>
        <Text>{baseLocale.nom || 'Base Adresse Locale'}</Text>
        <Text color='muted'>{' > '}</Text>
        <Text>{commune.nom}</Text>
      </Pane>
    )
  }

  return (
    <Pane paddingY={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' {...props}>
      <NextLink href='/'>
        <HomeIcon style={{verticalAlign: 'middle', color: '#000'}} />
      </NextLink>
      <Text color='muted'>{' > '}</Text>
      <Text>{baseLocale.nom || 'Base Adresse Locale'}</Text>
      <Text color='muted'>{' > '}</Text>

      <Link is={NextLink} href={`/bal/${baseLocale._id}`}>
        {commune.nom}
      </Link>

      <Text color='muted'>{' > '}</Text>
      <Text>{voie?.nom || toponyme.nom}</Text>
    </Pane>
  )
}

export default Breadcrumbs
